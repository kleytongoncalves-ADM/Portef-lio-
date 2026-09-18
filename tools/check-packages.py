"""Check the complete downloadable Sheets packages without modifying them."""
from io import BytesIO
from pathlib import Path
import hashlib
import json
import re
import zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
COMPONENTS = {"facilities": 4, "imoveis": 3, "frota": 3, "estacionamento": 4}
SHEET_NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
PRIVATE_LINK = re.compile(r"(?:docs\.google\.com/spreadsheets/d/|drive\.google\.com/(?:file/d/|drive/folders/))(?!__)[A-Za-z0-9_-]{25,}")
SECRET = re.compile(r"(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{40,}|AIza[0-9A-Za-z_-]{30,})")
PRIVATE_IMPORT = re.compile(r'IMPORTRANGE\s*\(\s*"(?!__)[A-Za-z0-9_-]{25,}"', re.I)


def quoted_values(formula):
    """Decode Excel string chunks, including the concatenations in DUMMYFUNCTION."""
    index = 0
    while index < len(formula):
        if formula[index] != '"':
            index += 1
            continue
        value = ""
        while True:
            index += 1
            while index < len(formula):
                if formula[index] == '"':
                    if index + 1 < len(formula) and formula[index + 1] == '"':
                        value += '"'
                        index += 2
                        continue
                    index += 1
                    break
                value += formula[index]
                index += 1
            tail = re.match(r'\s*&\s*"', formula[index:])
            if not tail:
                break
            index += tail.end() - 1
        yield value


def inspect_formula(formula, context):
    for text in [formula, *quoted_values(formula)]:
        assert not PRIVATE_LINK.search(text) and not PRIVATE_IMPORT.search(text), f"{context}: private reference in reconstructed formula"


def inspect_manifest(value, context):
    if isinstance(value, dict):
        for item in value.values():
            inspect_manifest(item, context)
    elif isinstance(value, list):
        for item in value:
            inspect_manifest(item, context)
    elif isinstance(value, str):
        inspect_formula(value, context)


def check(module, count):
    path = ROOT / "downloads" / module / f"{module}-pacote-google-planilhas.zip"
    raw = path.read_bytes()
    with zipfile.ZipFile(BytesIO(raw)) as package:
        assert package.testzip() is None, f"{module}: damaged ZIP"
        names = package.namelist()
        assert len(names) == len(set(names)), f"{module}: duplicate ZIP members"
        assert all(not n.startswith("/") and ".." not in Path(n).parts for n in names), f"{module}: unsafe archive path"
        by_name = {Path(n).name: n for n in names if not n.endswith("/")}
        for required in ("ConfigurarModelos.gs", "appsscript.json", "INSTALACAO-PT.md", "INSTALLATION-EN.md"):
            assert required in by_name, f"{module}: missing {required}"
            if required in ("ConfigurarModelos.gs", "appsscript.json"):
                assert package.read(by_name[required]) == (ROOT / "tools" / required).read_bytes(), f"{module}: outdated installer {required}"
        candidates = []
        for name in names:
            if name.endswith(".json"):
                obj = json.loads(package.read(name))
                if isinstance(obj, dict) and "schemaVersion" in obj and "components" in obj:
                    candidates.append(obj)
            if name.endswith((".md", ".json", ".gs", ".txt")):
                text = package.read(name).decode("utf-8")
                assert not PRIVATE_LINK.search(text), f"{module}: private source link in {name}"
                assert not SECRET.search(text), f"{module}: credential in {name}"
        assert len(candidates) == 1, f"{module}: expected one setup manifest"
        manifest = candidates[0]
        inspect_manifest(manifest, module)
        assert manifest["schemaVersion"] == 1 and manifest["moduleId"] == module
        assert len(manifest["components"]) == count
        keys = {c["key"] for c in manifest["components"]}
        assert len(keys) == count and set(manifest.get("tokens", {}).values()) <= keys
        details = []
        for component in manifest["components"]:
            filename = component["filename"]
            assert filename in by_name, f"{module}: missing {filename}"
            with zipfile.ZipFile(BytesIO(package.read(by_name[filename]))) as workbook:
                assert workbook.testzip() is None, f"{module}: damaged workbook {filename}"
                xml = ET.fromstring(workbook.read("xl/workbook.xml"))
                sheets = xml.findall("m:sheets/m:sheet", SHEET_NS)
                assert [s.attrib["name"] for s in sheets] == [s.get("importTitle", s["title"]) for s in component["sheets"]], f"{module}: import tab names differ from manifest: {filename}"
                assert sum(s["gridProperties"]["rowCount"] * s["gridProperties"]["columnCount"] for s in component["sheets"]) <= 10_000_000
                for name in workbook.namelist():
                    if name.endswith((".xml", ".rels")):
                        text = workbook.read(name).decode("utf-8")
                        parsed = ET.fromstring(text)
                        assert not PRIVATE_LINK.search(text), f"{module}: private source link in {filename}/{name}"
                        assert not SECRET.search(text), f"{module}: credential in {filename}/{name}"
                        for formula in parsed.iter("{" + SHEET_NS["m"] + "}f"):
                            inspect_formula(formula.text or "", f"{module}/{filename}/{name}")
                chart_count = sum(bool(re.fullmatch(r"xl/charts/chart\d+\.xml", n)) for n in workbook.namelist())
                restored_charts = sum(len(s.get("charts", [])) for s in component["sheets"])
                additions = {r["addChart"]["chart"]["chartId"] for r in component.get("requests", []) if "addChart" in r}
                for sheet in component["sheets"]:
                    for chart in sheet.get("charts", []):
                        if chart.get("createIfMissing"):
                            assert chart["sourceChartId"] in additions, f"{module}: missing chart restoration request"
                details.append({"component": component["key"], "sheets": len(sheets), "chartsInTransport": chart_count, "chartsInManifest": restored_charts})
        assert sum(max(c["chartsInTransport"], c["chartsInManifest"]) for c in details) >= (10 if module == "frota" else 14), f"{module}: original dashboard charts missing"
        return {"module": module, "bytes": len(raw), "sha256": hashlib.sha256(raw).hexdigest(), "components": details}


if __name__ == "__main__":
    print(json.dumps([check(module, count) for module, count in COMPONENTS.items()], ensure_ascii=False, indent=2))
