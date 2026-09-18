# Imóveis / Properties

## Português

### Finalidade

Relacionar cadastro, contratos e despesas por imóvel. O vínculo **próprio ou locado** pertence ao cadastro. Aluguéis, condomínios, IPTU e taxas têm registros distintos e composição identificável.

### Usar a demonstração

1. Filtre por imóvel, competência e natureza quando esses controles estiverem disponíveis.
2. Consulte composição de despesas, vencimentos, tabela e indicadores.
3. Selecione um registro para detalhar e editar os campos fictícios oferecidos.
4. Restaure os exemplos para desfazer as alterações da sessão.

Todos os dados são fictícios. Edições permanecem na sessão do navegador (`sessionStorage`, com memória temporária como alternativa). Não há gravação nas fontes ou transmissão dos dados editados.

### Entender as situações

| Situação | Significado |
| --- | --- |
| Vigência contratual | Período do contrato; não é o vencimento de uma despesa. |
| Despesa vencida sem lançamento | Data válida anterior à referência e ausência de valor positivo lançado. |
| Lançamento positivo | Valor registrado; não comprova quitação. |
| Protocolo ou lançamento sem vencimento | Pendência de dados que exige conferência. |
| Imóvel próprio | Vínculo cadastral; não elimina automaticamente despesas como taxas ou tributos. |

Não interprete um atraso de lançamento como inadimplência confirmada. Datas ausentes permanecem ausentes; não são substituídas por vencimentos presumidos. O vínculo dos registros usa a identidade do imóvel e suas relações contratuais, evitando juntar imóveis apenas pelo nome do locador.

### Arquivos e configuração

O conjunto nativo envolve **operacional de imóveis → base auxiliar → painéis de imóveis**. A operacional preserva cadastro, vigências, Aluguéis, Condomínios, IPTU e Taxas. A base mantém normalização e vínculos. Os painéis oferecem visão contratual, composição de gastos, histórico, atrasos e anomalias.

O guia e a demonstração web não são uma cópia completa das planilhas. No pacote da área de downloads, importe todos os componentes, configure suas referências externas com o instalador e autorize as conexões na ordem operacional, base e painéis. Confira uma despesa de cada natureza e um caso sem vencimento antes do uso.

Planilhas em português, com funções nativas do Google Planilhas. Compatibilidade com Excel não é presumida. Dados bancários, pessoas, documentos internos e endereços privados não integram o material demonstrativo. A versão pública precisa limpar também caches e abas ocultas; ocultar conteúdo não o remove do arquivo.


### Baixar e instalar o modelo

[Baixar o pacote completo para Google Planilhas](../downloads/imoveis/imoveis-pacote-google-planilhas.zip). O ZIP contém cópias derivadas das planilhas originais, dados fictícios, manifesto de restauração e instalador. Siga `INSTALACAO-PT.md` dentro do pacote: importe todos os componentes, execute a configuração e autorize as conexões entre suas próprias cópias. Os arquivos XLSX servem como transporte para o Google Planilhas; não são apresentados como sistemas compatíveis com Excel.

## English

### Purpose

Link property records, contracts and expenses by property. The **owned or leased** classification belongs to the property register. Rent, condominium charges, property tax and fees have separate records with identifiable composition.

### Use the demonstration

1. Filter by property, period and expense category where those controls are available.
2. Review expense composition, due dates, the table and indicators.
3. Select a record to inspect it and edit the available fictional fields.
4. Reset the examples to discard session changes.

All data is fictional. Edits stay in the browser session (`sessionStorage`, with temporary memory as a fallback). The sources are not updated and edited data is not transmitted.

### Understand record states

| State | Meaning |
| --- | --- |
| Contract term | The contract period; not an expense’s due date. |
| Past-due expense without an entry | A valid date before the reference date, without a positive amount recorded. |
| Positive entry | A recorded amount; it does not prove settled payment. |
| Document reference or entry without a due date | A data issue requiring review. |
| Owned property | A register classification; it does not automatically eliminate fees or taxes. |

Do not interpret an overdue entry as a confirmed payment default. Missing dates stay missing rather than becoming assumed deadlines. Records are linked through property identity and contract relationships, avoiding combinations based only on a landlord’s name.

### Files and setup

The native set requires **property operations → supporting base → property dashboards**. Operations retain the property register, contract terms, rent, condominium charges, property tax and fees. The base retains normalization and links. Dashboards cover contracts, expense composition, history, overdue entries and data issues.

This guide and the web demonstration are not complete spreadsheet copies. Import every component from the download package, configure external references with the included setup script and authorize connections in the order operations, base and dashboards. Verify one expense of each category and a missing-due-date case before use.

Spreadsheets are in Portuguese and use native Google Sheets functions. Excel compatibility is not assumed. Banking details, personal information, internal documents and private addresses are excluded from the demonstration. Public copies must also clear caches and hidden sheets; hiding content does not remove it from a file.

### Download and install the model

[Download the complete Google Sheets package](../downloads/imoveis/imoveis-pacote-google-planilhas.zip). The ZIP includes copies derived from the original spreadsheets, fictional data, a restoration manifest and setup script. Follow `INSTALLATION-EN.md` inside the package: import every component, run setup and authorize connections between your own copies. The XLSX files transport the models into Google Sheets; they are not presented as Excel-compatible systems.
