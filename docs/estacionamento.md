# Estacionamento / Parking

## Português

### Finalidade

Apresentar os contratos de estacionamento em uma área independente. A classificação vem do **objeto do contrato**, e os registros continuam ligados aos identificadores de contrato e vigência. O nome da empresa, sozinho, não permite unir registros com segurança.

A origem contém os contratos dentro da operacional geral. O painel web deste módulo é uma **adaptação temática**; não representa um painel nativo exclusivo que já existisse nas fontes.

### Usar a demonstração

Escolha os filtros disponíveis de local, contrato e competência. Explore o resumo, os registros mensais e o detalhe do contrato. Edite somente os campos fictícios oferecidos e use **Restaurar exemplos** para voltar ao estado inicial.

Edições ficam em `sessionStorage` durante a sessão do navegador, com memória temporária como alternativa. Nenhum dado é enviado às planilhas de origem.

### Interpretar os valores

| Campo | Leitura correta |
| --- | --- |
| Valor contratado | Valor registrado para o contrato, com sua natureza e período. |
| Previsão mensal | Valor mensal explicitamente disponível; não resulta automaticamente do valor global dividido por 12. |
| Vagas | Quantidade expressamente registrada. Ausência permanece “não informada”. |
| Documento | Referência documental; não comprova liquidação ou pagamento. |
| Valor lançado | Registro positivo; não equivale a pagamento confirmado. |
| Vigência em tramitação | Novo período ainda acompanhado separadamente da vigência atual. |

Os exemplos não atribuem uma vaga a um contrato apenas porque seu objeto usa a palavra “vaga”. O mesmo fornecedor pode ter mais de um contrato ou local, que permanecem distintos.

### Arquivos e configuração

Um pacote nativo temático precisa de **quatro arquivos: fonte complementar temática de pagamentos → operacional recortada → base auxiliar → painel**. A fonte complementar, intitulada “2026 - Gestão de Pagamento de Energia, Água e Imóveis - CREA”, alimenta a operacional pelas abas **Estacionamentos** e **CONEXÃO GEIN**. Ela também contém quantidades de vagas e registros cuja vinculação contratual precisa de conferência. Um registro sem vínculo não entra automaticamente na contagem de contratos válidos. A separação deve preservar todos os ciclos, aditivos e movimentos ligados aos contratos escolhidos. Esses mesmos registros não podem voltar a ser somados no pacote de Obras e Facilities.

O guia e a demonstração não substituem o conjunto nativo. Use somente arquivos que estiverem efetivamente disponíveis na área de downloads. Quando oferecido, copie o conjunto completo, ajuste as referências entre suas novas cópias e autorize as conexões na ordem fonte complementar → operacional → base → painel. Confira contratos distintos do mesmo fornecedor, casos sem quantidade de vagas e registros sem vínculo.

Planilhas em português. O recorte exige referências próprias, sem conexão às fontes institucionais e sem outros contratos, pessoas ou documentos reais. Compatibilidade com Excel depende de validação específica.

## English

### Purpose

Present parking contracts in a dedicated area. Classification comes from the **contract scope**, while records remain linked to contract and term identifiers. A company name alone is not a reliable basis for combining records.

The source stores these contracts in the general operational workbook. This module’s web dashboard is a **dedicated adaptation**; it does not represent a pre-existing native parking-only dashboard.

### Use the demonstration

Choose the available location, contract and period filters. Explore the summary, monthly entries and contract details. Edit only the available fictional fields and use **Reset examples** to restore the initial state.

Edits stay in `sessionStorage` for the browser session, with temporary memory as a fallback. No data is sent to the source spreadsheets.

### Interpret the amounts

| Field | Correct interpretation |
| --- | --- |
| Contract value | The recorded contract amount, with its basis and period. |
| Monthly forecast | An explicitly available monthly amount; not automatically the global value divided by 12. |
| Parking spaces | An explicitly recorded quantity. Missing values remain “not specified.” |
| Document | A document reference; not proof of settlement or payment. |
| Recorded amount | A positive entry; not confirmed payment. |
| Term under review | A new period tracked separately from the current term. |

The examples do not assign one space simply because a contract scope uses the word “space.” The same supplier can have several contracts or locations, which remain distinct.

### Files and setup

A dedicated native package requires **four files: area-specific payment source → selected operations → supporting base → dashboard**. The supporting source, titled “2026 - Gestão de Pagamento de Energia, Água e Imóveis - CREA”, feeds operations through the **Estacionamentos** and **CONEXÃO GEIN** tabs. It also contains recorded parking-space quantities and entries whose contract link needs review. An unlinked entry does not automatically count as a valid contract. The separation must preserve every cycle, amendment and transaction linked to the selected contracts. Those same records must not be counted again in Works & Facilities.

This guide and the demonstration do not replace the native set. Use only files explicitly available in the downloads section. When offered, copy the complete set, update references between your copies and authorize connections in the order payment source → operations → base → dashboard. Check distinct contracts with the same supplier, missing space counts and unlinked entries.

Spreadsheets remain in Portuguese. The selection needs its own references, without institutional-source connections or unrelated contracts, personal data and real internal documents. Excel compatibility requires separate validation.
