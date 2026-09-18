# Estacionamento — modelo para Google Planilhas

Este pacote deriva das planilhas fornecidas e conserva suas matrizes, abas, fórmulas, cores, validações e painéis. Os dados institucionais foram substituídos por 8 contratos fictícios. Para usar, siga **INSTALACAO-PT.md**. Os XLSX são arquivos de transporte; não são versões funcionais independentes para Excel.

## Componentes

| Chave no instalador | Arquivo | Uso |
| --- | --- | --- |
| `extra` | MODELO-PUBLICO-ESTACIONAMENTO-EXTRA.xlsx | Lançamentos mensais e conexão temática |
| `op` | MODELO-PUBLICO-ESTACIONAMENTO-OP.xlsx | Vigências, pagamentos, aditivos e saldos |
| `aux` | MODELO-PUBLICO-ESTACIONAMENTO-AUX.xlsx | Normalização, vínculos, cálculos e validação |
| `dash` | MODELO-PUBLICO-ESTACIONAMENTO-DASH.xlsx | Painéis, consultas e 14 gráficos do arquivo de referência |

Use `manifesto-modelos.json`. Autorize as conexões nesta ordem: **EXTRA → OP → AUX → DASH**. Na operacional, comece por `PAGAMENTOS SERVIÇO!QI1`; na auxiliar, por `CFG PARÂMETROS!E2` e pelos imports RAW; nos painéis, pelas células de importação AA1. O instalador substitui os marcadores pelos IDs das suas próprias cópias. Depois de autorizar as conexões e os dados carregarem, execute `restaurarGraficos()` para reaplicar a apresentação nativa dos gráficos.

## O que foi preservado e adaptado

- Sete abas operacionais, 56 auxiliares, 14 de painéis e as três abas da fonte complementar que participam da ligação. Os dados de outros assuntos foram removidos; as abas técnicas compartilhadas permanecem para preservar referências. As visões exclusivamente de imóveis ficam ocultas e sem entradas reais.
- Matrizes mensais, separação serviço/material, chaves contratuais e de vigência, aditivos, histórico, projeção, renovação e critério de risco negativo conservados. Estacionamento e Facilities usam exemplos separados. Dois contratos podem ter a mesma empresa sem se misturar.
- Estilos de células, mesclagens, regras condicionais, validações, congelamentos e proteções presentes nos XLSX foram comparados com o arquivo de referência. Os 14 gráficos foram mantidos, com caches antigos removidos. O manifesto também restaura as especificações nativas: fontes, cores, séries, eixos, posições e bordas. Os seis gráficos da aba externa `Gráficos`, alheia às três abas contribuintes, não integram este recorte.
- A camada de vigências que estava estática na fonte foi ligada à operacional do próprio pacote. Duas pendências específicas de dados reais e quatro expressões aritméticas que continham valores reais foram removidas. A tabela de risco ganhou uma proteção de exibição quando não há itens, sem mudar o critério de insuficiência.
- Notas/comentários pessoais, links externos das fontes, dados bancários, contratos, documentos, processos, filtros de dados reais e caches foram retirados. Links internos de navegação e todas as mesclagens do painel são restaurados pelo instalador.

## Começar a preencher

1. Conclua a instalação e as autorizações antes de inserir dados de uso.
2. Em `VIGÊNCIAS DO CONTRATO`, substitua exemplos de empresa, objeto, contrato, processo, datas e empenhos. Mantenha um identificador distinto por contrato.
3. Ajuste as chaves nas colunas auxiliares da operacional e o mapa Q:U de `CONEXÃO GEIN` de modo consistente. Os exemplos mostram a relação entre os quatro componentes.
4. Lance pagamentos na aba temática do EXTRA; os pagamentos de serviço de 2026 são importados para a matriz operacional. Material e aditivos continuam nas entradas correspondentes da operacional. Não escreva sobre as áreas calculadas.
5. Confira cadastro, movimentações, saldos, renovações e pendências na AUX; consulte os resultados na DASH.

Um valor positivo registrado é um **pagamento lançado**. Ele não comprova quitação. A aprovação documental do aditivo fictício permanece pendente até preenchimento na conferência.

## Conferência de instalação

Com os exemplos e após todas as conexões: o painel contratual deve mostrar valor original **R$ 105.600,00**, com aditivo **R$ 106.800,00** e saldo atual agregado **R$ 54.000,00**. O total de serviço lançado nos seis meses de exemplo é **R$ 52.800,00**. O primeiro contrato tem saldo de serviço **R$ 3.600,00** e saldo projetado de serviço **R$ 1,200,00**, portanto sem risco.

Esses resultados foram conferidos no motor do Google Planilhas com entradas fictícias temporariamente injetadas entre os componentes. A autorização ao vivo de IMPORTRANGE e o recálculo integral de cada cópia do visitante precisam ser feitos após a instalação. Consulte **VERIFICACAO.md**.
