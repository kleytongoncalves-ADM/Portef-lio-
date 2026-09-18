# Frota — pacote para Google Planilhas

Este pacote deriva dos três arquivos do modelo fornecido: operacional, auxiliares e painéis. Mantém as 26 abas, 10 gráficos e fórmulas do modelo, com entradas fictícias. Os XLSX servem para transporte; o uso depende da importação para Google Planilhas e da restauração nativa. Não há promessa de funcionamento no Microsoft Excel.

## Arquivos e ordem

| Componente | Arquivo | Abas |
|---|---|---:|
| Entrada e cadastros | MODELO-PUBLICO-FROTA-OPERACIONAL.xlsx | 3 |
| Cálculos e saídas | MODELO-PUBLICO-FROTA-AUXILIARES.xlsx | 14 |
| Relatórios e gráficos | MODELO-PUBLICO-FROTA-PAINEIS.xlsx | 9 |

1. Siga `INSTALACAO-PT.md`. Importe os três arquivos, conservando os nomes acima sem `.xlsx`.
2. Use `manifesto-frota.json` e as chaves `operacional`, `auxiliares` e `paineis` no instalador.
3. Conclua a restauração. O instalador recupera nomes completos, grades, fórmulas nativas, fuso, configuração regional, validações e propriedades registradas.
4. Abra AUXILIARES, aba **CONEXÕES**, célula **B2**, e autorize o acesso ao seu OPERACIONAL quando o Google oferecer **Permitir acesso**. Aguarde o processamento.
5. Abra PAINEIS, aba **CONEXÕES**, célula **O8**, e autorize o acesso ao seu AUXILIARES. Confira os demais indicadores de conexão e aguarde o recálculo.
6. Quando as conexões estiverem prontas, execute **restaurarGraficos** no mesmo projeto Apps Script, antes de renomear os arquivos. O Google pode descartar estilos das séries se a restauração dos gráficos ocorrer enquanto os dados exibem `#REF!`. Essa função reaplica as configurações originais, sem alterar os dados ou as fórmulas.
7. Confira os valores de exemplo no relatório `VERIFICACAO-FROTA.md`.

Os três arquivos devem permanecer separados. As grades do modelo somam 13.901.902 células; a instalação preserva a divisão original em três planilhas.

## Dados e regras

As entradas de demonstração têm 1.339 registros e 83 veículos, de janeiro a agosto de 2026. Pessoas, placas, cartões, postos, valores e demais identificadores são fictícios. As regras de consumo, quilometragem, alertas e duplicidades vêm do modelo, sem substituição por regras genéricas. Os indicadores de consumo importado e o motor de quilometragem gerencial têm finalidades diferentes; lavagens continuam identificadas como serviço.

A aba CONEXÕES dos painéis foi deixada visível para permitir a instalação; essa alteração de navegação está documentada. As abas auxiliares ocultas e a disposição das demais abas são preservadas. Depois da instalação, CONEXÕES pode ser ocultada novamente.

Scripts e gatilhos vinculados aos arquivos de origem não são exportados. As fórmulas operacionais, auxiliares e dos painéis foram ensaiadas no Google Planilhas com entradas fictícias. O instalador incluído serve apenas à restauração do pacote. Autorizações de IMPORTRANGE precisam ser concedidas na conta de quem instalar.

## English

This package follows the supplied fleet model: three workbooks, 26 tabs and 10 charts, with fictional inputs. XLSX files are transport containers for Google Sheets, not a claim of Excel compatibility. Follow `INSTALLATION-EN.md`, using `manifesto-frota.json` and component keys `operacional`, `auxiliares`, `paineis`.

After installation, authorize the supporting workbook's **CONEXÕES!B2** connection to your operations workbook, then the dashboard's **CONEXÕES!O8** connection to your supporting workbook. Wait for recalculation. Run **restaurarGraficos** afterward to restore chart series styling once data is available. Do this before renaming the files.

The dashboard connection tab is visible to help setup. Original bound scripts and triggers are not included. `VERIFICACAO-FROTA.md` describes the native calculation tests and limitations. The original private files are not required.
