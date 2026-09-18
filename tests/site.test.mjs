import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { content } from '../assets/content.mjs';
import { ui } from '../assets/ui.mjs';
import { EXAMPLE_DATA } from '../modules/demos.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const routes = {
  facilities: 'obras-facilities.html',
  imoveis: 'imoveis.html',
  frota: 'frota.html',
  estacionamento: 'estacionamento.html',
  precos: 'mapa-de-preco.html',
};
const read = file => readFile(path.join(root, file), 'utf8');
const exists = async file => {
  try { await access(path.join(root, file)); return true; } catch { return false; }
};

async function publicFiles(directory = '') {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const nested = await Promise.all(entries.filter(entry => !entry.name.startsWith('.') && !['tests', 'node_modules'].includes(entry.name)).map(entry => {
    const file = path.posix.join(directory, entry.name);
    return entry.isDirectory() ? publicFiles(file) : [file];
  }));
  return nested.flat();
}

test('every published project has a route, a demo and a downloadable guide in both languages', async () => {
  for (const lang of ['pt', 'en']) {
    assert.deepEqual(content[lang].modules.map(module => module.id).sort(), Object.keys(routes).sort());
    for (const module of content[lang].modules) {
      const html = await read(routes[module.id]);
      assert.ok(html.includes(`data-page="${module.id}"`), `${routes[module.id]} must select the corresponding project`);
      assert.ok(EXAMPLE_DATA[module.id]?.length > 0, `Missing interactive data for ${module.id}`);
      assert.ok(await exists(module.guide), `Missing ${lang} guide: ${module.guide}`);
      const guide = await read(module.guide);
      assert.ok(/^## Português\s*$/m.test(guide), `Missing Portuguese guide boundary: ${module.guide}`);
      assert.ok(/^## English\s*$/m.test(guide), `Missing English guide boundary: ${module.guide}`);
      assert.ok(guide.indexOf('## Português') < guide.indexOf('## English'), `Guide language boundaries must follow the reader's order: ${module.guide}`);
      assert.ok(module.limitations.length > 0, `Missing limitations: ${lang}/${module.id}`);
    }
  }
  assert.ok(await exists('guia.html'), 'The online guide route must be present');
});

test('all static local links, image paths and ES module imports resolve', async () => {
  const files = await publicFiles();
  const failures = [];
  for (const file of files.filter(file => /\.(?:html|mjs|md)$/.test(file))) {
    const source = await read(file);
    const refs = [];
    for (const match of source.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) refs.push({ target: match[1], base: file.endsWith('.mjs') ? '' : path.posix.dirname(file) });
    for (const match of source.matchAll(/(?:from\s*|import\s*\()(['"])(\.{1,2}\/[^'"]+)\1/g)) refs.push({ target: match[2], base: path.posix.dirname(file) });
    if (file.endsWith('.md')) for (const match of source.matchAll(/\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)) refs.push({ target: match[1], base: path.posix.dirname(file) });
    for (const { target, base } of refs) {
      if (target.includes('${') || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(target)) continue;
      const pathname = target.split(/[?#]/)[0];
      if (!pathname) continue;
      const local = path.posix.normalize(path.posix.join(base, decodeURIComponent(pathname)));
      if (!(await exists(local))) failures.push(`${file}: ${target} → ${local}`);
    }
  }
  assert.deepEqual(failures, [], 'Every advertised local file must exist');
});

test('language dictionaries contain the same UI keys and complete translated project fields', () => {
  function compare(a, b, location) {
    if (Array.isArray(a)) {
      assert.ok(Array.isArray(b), location);
      assert.equal(a.length, b.length, `${location} array length`);
      a.forEach((item, index) => compare(item, b[index], `${location}[${index}]`));
    } else if (a && typeof a === 'object') {
      assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), location);
      for (const key of Object.keys(a)) compare(a[key], b[key], `${location}.${key}`);
    } else {
      assert.equal(typeof b, typeof a, location);
      if (typeof b === 'string') assert.ok(b.trim().length, `Empty translation: ${location}`);
    }
  }
  compare(content.pt, content.en, 'content');
  compare(ui.pt, ui.en, 'ui');
});

test('public files contain no source Drive links, spreadsheet credentials or raw uploaded originals', async () => {
  const files = await publicFiles();
  const forbiddenName = /(?:Kleyton-Goncalves-Silva-Curriculo\(1\)\.pdf|texto.colado|MODELO COMPARATIVO|\.env(?:\.|$))/i;
  const forbiddenText = /https?:\/\/(?:docs\.google\.com\/spreadsheets\/d\/|drive\.google\.com\/(?:drive\/folders|file\/d)\/)|(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{40,}|AIza[0-9A-Za-z_-]{30,})/;
  const problems = [];
  for (const file of files) {
    if (forbiddenName.test(path.basename(file))) problems.push(`Potential original/private artifact: ${file}`);
    if (/\.(?:html|mjs|js|css|md|json|txt|svg)$/.test(file) && forbiddenText.test(await read(file))) problems.push(`Private source reference or credential: ${file}`);
  }
  assert.deepEqual(problems, []);
  for (const [module, rows] of Object.entries(EXAMPLE_DATA)) {
    for (const row of rows) {
      assert.match(row.id, /^DEMO-/, `${module}: non-demo record identifier`);
      assert.match(row.entity, /^DEMO-/, `${module}: non-demo entity identifier`);
      for (const field of ['driver', 'station', 'provider', 'protocol']) if (row[field]) assert.match(row[field], /^DEMO-/, `${module}/${field}`);
    }
  }
});

test('downloadable workbook is the exact sanitized artifact described by its verification manifest', async () => {
  const manifest = JSON.parse(await read('downloads/precos/verificacao.json'));
  const bytes = await readFile(path.join(root, 'downloads/precos', manifest.file));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.sha256);
  assert.equal(manifest.external_links_present, false);
  assert.equal(manifest.hidden_sheets_present, false);
  assert.equal(manifest.vba_project_present, false);
  assert.ok(await exists('downloads/precos/mapa-preco-pacote-publico.zip'));
  assert.ok(await exists('downloads/precos/previa-modelo-publico.png'));
});
