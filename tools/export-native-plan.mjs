#!/usr/bin/env node
/**
 * Read-only local compiler for native integration validation.
 * Input snapshots are read from the real disposable Google Sheets copies.
 * Never check IDs, snapshots or the output plan into the public repository.
 *
 * node tools/export-native-plan.mjs --manifest /tmp/manifesto.json \
 *   --ids /tmp/ids.json --snapshots /tmp/copies.json --out /tmp/plan.json
 *
 * copies.json: {componentKey:{mimeType,name,trashed:false,overflowChecked:true,
 *   spreadsheet:{spreadsheetId,properties,sheets,developerMetadata}}}
 * Set overflowChecked:true only after reading pmOverflowRanges_ and proving all
 * values empty, or proving no grid reduction is needed. This flag is evidence
 * supplied by the validator, not an automatic assertion made by this utility.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, arg, i, all) => {
  if (i % 2 === 0) pairs.push([arg, all[i + 1]]);
  return pairs;
}, []));
for (const arg of ['--manifest', '--ids', '--snapshots', '--out']) {
  if (!args[arg]) throw new Error(`Missing ${arg}. Read the command example in this file.`);
}
const context = vm.createContext({console});
const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'ConfigurarModelos.gs');
vm.runInContext(fs.readFileSync(scriptPath, 'utf8'), context);
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const copies = read(args['--snapshots']);
const plan = context.pmBuildPlan_(read(args['--manifest']), read(args['--ids']), copies, hash);
for (const component of plan.components) {
  for (const batch of component.batches) {
    if (batch.kind === 'grid-reduction') {
      batch.requests = context.pmShrinkGridRequests_(batch.requests, copies[component.key].spreadsheet.sheets);
    } else {
      batch.requests = context.pmRestoreMissingCharts_(batch.requests, copies[component.key].spreadsheet.sheets);
    }
    batch.requests.push({createDeveloperMetadata:{developerMetadata:{
      metadataKey:plan.markerKey, metadataValue:`${batch.index}:${batch.checksum}`,
      location:{spreadsheet:true}, visibility:'DOCUMENT'
    }}});
  }
}
fs.mkdirSync(path.dirname(path.resolve(args['--out'])), {recursive:true});
fs.writeFileSync(args['--out'], JSON.stringify(plan));
console.log(JSON.stringify({
  moduleId:plan.moduleId,
  components:plan.components.map(component => ({key:component.key,batches:component.batches.length})),
  output:args['--out']
}));
