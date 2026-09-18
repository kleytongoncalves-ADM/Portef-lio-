# Obras e Facilities / Works & Facilities

## Português

### Finalidade

Controle administrativo de contratos, vigências, empenhos, lançamentos, aditivos, previsões e renovações. Serviços e materiais são acompanhados separadamente. Contratos de estacionamento pertencem ao módulo próprio e não entram novamente neste recorte.

### Usar a demonstração

1. Escolha os filtros disponíveis de competência, contrato e natureza.
2. Observe os indicadores, a tabela e o gráfico; todos usam os registros do filtro.
3. Selecione um registro para consultar seus detalhes e edite apenas os campos demonstrativos oferecidos.
4. Use **Restaurar exemplos** para voltar aos dados iniciais.

Os dados são fictícios. As alterações ficam em `sessionStorage` nesta sessão do navegador, com memória temporária como alternativa quando o armazenamento não está disponível. Não há envio para as planilhas de origem. Fechar a sessão ou restaurar os exemplos pode eliminar as alterações.

### Ler os resultados

- **Lançamento:** valor registrado; não comprova pagamento liquidado.
- **Saldo:** empenho da natureza + aditivos incorporáveis − lançamentos vinculados.
- **Projeção da demonstração:** média e competências sem lançamento são entradas explícitas do exemplo. O motor completo de associação de ciclos não foi transportado para o site.
- **Risco:** saldo projetado negativo, arredondado em centavos. Zero e pequenos saldos positivos não representam insuficiência.
- **Renovação:** a origem acompanha janela de 120 dias, distinguindo término atual de uma nova vigência em tramitação.

Na origem, o vínculo entre contrato, natureza, vigência e movimento determina o ciclo. Movimento fora da vigência é preservado para conferência. A projeção preenche competências sem lançamento positivo, inclusive lacunas anteriores. Aditivo incorporável não significa aprovação documental comprovada quando essa confirmação não existe na fonte.

### Arquivos e configuração

O conjunto nativo requer **quatro arquivos: fonte complementar temática de pagamentos → operacional de contratos → base auxiliar → painéis**. A fonte complementar, intitulada “2026 - Gestão de Pagamento de Energia, Água e Imóveis - CREA”, alimenta a operacional por meio das abas **Prestação de serviços** e **CONEXÃO GEIN**. Retirar essa conexão ou substituir seus resultados por valores fixos retiraria uma funcionalidade do trabalho original. O guia, o código web e os dados demonstrativos não substituem essas planilhas. Use apenas os arquivos que estiverem efetivamente indicados como disponíveis na área de downloads.

Para um conjunto nativo disponibilizado: copie os componentes para sua conta, registre os identificadores das novas cópias, configure primeiro a fonte complementar temática e seu vínculo contratual, ajuste as referências externas documentadas entre as quatro cópias e autorize as conexões na ordem fonte complementar → operacional → base → painéis e confira um caso conhecido antes de inserir dados próprios. Não conecte cópias públicas às fontes institucionais.

As planilhas ficam em português. As exportações Excel inspecionadas apresentaram fórmulas convertidas para funções de compatibilidade sem cálculo equivalente; por isso, não são oferecidas como sistema utilizável. Foram encontrados trechos estáticos de vigências na base original; uma indicação de conexão ativa não comprova atualização integral. O projeto não contém controle confirmado de execução física, medições de engenharia nem automação específica de repactuação.


### Baixar e instalar o modelo

[Baixar o pacote completo para Google Planilhas](../downloads/facilities/facilities-pacote-google-planilhas.zip). O ZIP contém cópias derivadas das planilhas originais, dados fictícios, manifesto de restauração e instalador. Siga `INSTALACAO-PT.md` dentro do pacote: importe todos os componentes, execute a configuração e autorize as conexões entre suas próprias cópias. Os arquivos XLSX servem como transporte para o Google Planilhas; não são apresentados como sistemas compatíveis com Excel.

## English

### Purpose

Administrative control of contracts, terms, budget commitments, entries, amendments, forecasts and renewals. Services and materials are tracked separately. Parking contracts belong to their dedicated module and are not counted again here.

### Use the demonstration

1. Choose the available period, contract and category filters.
2. Review the indicators, table and chart; all use the filtered records.
3. Select a record to inspect its details and edit only the available demonstration fields.
4. Use **Reset examples** to restore the initial data.

All data is fictional. Changes stay in `sessionStorage` for this browser session, with temporary memory as a fallback when storage is unavailable. Nothing is sent to the source spreadsheets. Ending the session or resetting the examples may remove your changes.

### Read the results

- **Entry:** a recorded amount; it does not establish settled payment.
- **Balance:** category budget commitment + eligible amendments − linked entries.
- **Demo forecast:** the average and periods without entries are explicit example inputs. The full financial-cycle association engine was not ported to the website.
- **Shortfall:** a negative projected balance, rounded to cents. Zero and small positive balances are not shortfalls.
- **Renewal:** the source monitors a 120-day window, distinguishing the current end date from a new term under review.

In the source, relationships between contract, category, term and transaction determine the financial cycle. Entries outside a term are retained for review. Forecasts fill periods without positive entries, including earlier gaps. An eligible amendment does not prove documented approval when that confirmation is missing from the source.

### Files and setup

The native set requires **four files: area-specific payment source → contract operations → supporting base → dashboards**. The additional source, titled “2026 - Gestão de Pagamento de Energia, Água e Imóveis - CREA”, feeds operations through the **Prestação de serviços** and **CONEXÃO GEIN** tabs. Removing that connection or replacing its results with fixed values would remove a feature of the original work. This guide, website code and demonstration data do not replace those spreadsheets. Use only files explicitly listed as available in the downloads section.

For a published native set: copy its components to your account, record your new copy identifiers, configure the area-specific payment source and its contract linkage first, update documented external references between the four copies, and authorize connections in the order payment source → operations → base → dashboards, then check a known example before adding your own data. Do not connect public copies to institutional sources.

Spreadsheets remain in Portuguese. The inspected Excel exports contained formulas converted to compatibility functions without equivalent calculation, so they are not offered as usable systems. Some contract-term source data was static; an active connection does not prove complete synchronization. The project has no confirmed physical construction-progress control, engineering measurement workflow or dedicated automated price-adjustment workflow.

### Download and install the model

[Download the complete Google Sheets package](../downloads/facilities/facilities-pacote-google-planilhas.zip). The ZIP includes copies derived from the original spreadsheets, fictional data, a restoration manifest and setup script. Follow `INSTALLATION-EN.md` inside the package: import every component, run setup and authorize connections between your own copies. The XLSX files transport the models into Google Sheets; they are not presented as Excel-compatible systems.
