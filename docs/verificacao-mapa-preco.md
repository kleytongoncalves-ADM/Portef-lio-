# Verificação da cópia pública / Public copy verification

Arquivo / File: `mapa-preco-modelo-publico.xlsm`

SHA-256: `74c58ea696b339645c192e94285aae3a336c127599310bf7cc5a9dfbedc38c37`

| Verificação / Check | Resultado / Result |
|---|---|
| Formato e conteúdo nativo / Native format | XLSM macro-enabled preservado; sem conversão para XLSX / Preserved; no XLSX conversion |
| Abas / Worksheets | 1, nome e ordem preservados / Name and order preserved |
| Fórmulas / Formulas | 40, conteúdo XML e posições idênticos / Identical XML content and positions |
| Caches de resultados / Cached results | Preservados, incluindo os 28 erros preexistentes / Preserved, including 28 pre-existing errors |
| Mesclagens / Merged ranges | 167, idênticas / Identical |
| Formatação / Formatting | Arquivo de estilos idêntico byte a byte / Style file byte-for-byte identical |
| Regras condicionais / Conditional rules | 2, idênticas / Identical |
| Linhas, colunas e impressão / Rows, columns and print settings | Idênticos / Identical |
| Células alteradas / Changed cells | Apenas títulos B1, B4, C4, E4, M4 e M35 / Headings only |
| Marca institucional / Institutional identity | Imagem e suas relações removidas / Image and relationships removed |
| Metadados pessoais / Personal metadata | Removidos / Removed |
| Identificadores reais / Real identifiers | Busca nos componentes publicados não encontrou os identificadores originais / No original identifiers found in published components |
| Conexões externas / External connections | Nenhuma encontrada / None found |
| VBA | Nenhum projeto presente no original ou na cópia / No project present in source or copy |
| Teste de cálculo / Calculation check | Entradas fictícias em cópia temporária: médias/medianas 240 e 120 conforme referências; peças 100 + serviços 30 = 130 / Disposable example inputs confirmed reference behavior and totals |
| Excel nativo / Native Excel | Não executado / Not executed |
| Google Planilhas / Google Sheets | Importação não verificada / Import not verified |

O arquivo é uma cópia sanitizada para apresentação do trabalho e estudo de sua estrutura. As limitações funcionais do original permanecem e estão descritas nos guias. Preservação estrutural não equivale a correção de todas as fórmulas ou compatibilidade certificada em outro aplicativo.

This file is a sanitized copy for presenting the work and inspecting its structure. The original functional limitations remain and are described in the guides. Structural preservation does not establish that every formula is correct or certify compatibility with another application.

## Alterações no pacote / Package changes

Foram alterados apenas `docProps/core.xml` (metadados), `xl/sharedStrings.xml` (seis títulos), `xl/worksheets/sheet1.xml` (remoção da referência à imagem) e `[Content_Types].xml` (remoção do tipo da imagem/desenho). Foram removidos a imagem institucional e seus três componentes de desenho/relação. Todos os demais componentes foram copiados sem alteração.

Only `docProps/core.xml` (metadata), `xl/sharedStrings.xml` (six headings), `xl/worksheets/sheet1.xml` (image reference removal) and `[Content_Types].xml` (drawing type removal) changed. The institutional image and its three drawing/relationship components were removed. All other package components were copied unchanged.

As células de título foram editadas pelo mecanismo de planilha, e somente seus textos autorizados foram transferidos ao pacote original. O arquivo final não foi substituído pelo resultado de um exportador de XLSX. Nenhuma fórmula, cache de cálculo, mesclagem ou estilo foi transferido de um arquivo reconstruído.

Heading cells were edited using a spreadsheet engine and only the approved text changes were applied to the original package. The final file was not replaced with an XLSX export. No formulas, cached results, merged ranges or styles were copied from a rebuilt workbook.

