# Frota / Fleet

## Português

### Finalidade e componentes

O projeto relaciona **FROTA GEIN — OPERACIONAL → FROTA GEIN — AUXILIARES → PAINÉIS FROTA GEIN**. A operacional recebe abastecimentos, serviços, cadastros e decisões de conferência. Auxiliares consolida dados e valida leituras. Painéis apresenta despesas, quilometragem, consumo, duplicidades e monitoramento de postos.

### Usar a demonstração

Filtre os registros pelos controles disponíveis de veículo, período e tipo. Indicadores, tabela e gráfico acompanham a seleção. Abra um registro para consultar seus detalhes, edite os campos fictícios permitidos e use **Restaurar exemplos** para desfazer as alterações. Edições ficam na sessão do navegador (`sessionStorage`, com memória temporária como alternativa). Nada é enviado às fontes.

### Regras e alcance

| Assunto | Regra confirmada na origem | Alcance da demonstração |
| --- | --- | --- |
| Despesas | Valores de abastecimentos e demais serviços; classificação da frota. | Recorte fictício com tipos identificáveis. |
| Consumo | Lavagem separada; KM rodado não positivo pede conferência; KM/L abaixo de 5 ou acima de 20 gera alerta. | Usa o KM/L recebido no exemplo; não confunde serviço com combustível. |
| Abastecimentos repetidos | Mais de um abastecimento do veículo na mesma data; fins de semana sinalizados. | Casos para análise, sem conclusão automática de irregularidade. |
| Duplicidade financeira | Grupo formado por data, motorista, placa, posto, valor e tipo; decisão por ID estável. | Identifica candidatos. Não executa todo o fluxo nativo de abatimentos. |
| Valor em análise | Soma dos lançamentos pendentes do grupo, não apenas do possível excedente. | Mantém a distinção entre valor analisado e eventual valor duplicado. |
| Quilometragem | Motor nativo com leitura válida anterior, histórico, mediana, limites e reconexões. | Conferência didática de deltas; não reproduz todo o motor. |

No original, um abatimento registrado em uma ocorrência remove seu grupo da visão financeira pendente. O histórico de postos pode conservar grupos já abatidos. Uma ocorrência não prova erro, fraude ou cobrança indevida.

O motor nativo de KM mantém apenas leituras válidas nos cálculos mensais. Para próprios e alugados, distribui intervalos válidos pelos meses proporcionalmente ao tempo coberto. Outras categorias usam interpolação própria. Sem cobertura, o resultado fica vazio; não se inventa quilometragem após a última leitura. A demonstração não implementa a mediana histórica, a reconexão de leituras ou o rateio mensal e não deve ser usada para substituir esse processamento.

### Arquivos e configuração

Um conjunto utilizável precisa dos três arquivos, dos cadastros e do registro de decisões. O guia e o código web não substituem essas dependências. Use somente arquivos indicados como disponíveis na área de downloads.

Para configurar cópias nativas: copie operacional, auxiliares e painéis; atualize **todas** as referências externas, inclusive as existentes fora das abas de conexões; autorize operacional → auxiliares → painéis; confira consumo, lavagem, repetição, abatimento, regressão e um intervalo que atravesse o primeiro dia do mês.

O original tem limites diferentes de linhas por motor e painel, além de intervalos fixos de cadastro e anos. Uma etiqueta de capacidade ou conexão saudável não garante processamento integral. Arquivos em português; não há compatibilidade Excel verificada, geolocalização ao vivo ou manutenção preventiva confirmada no conjunto inspecionado.


### Baixar e instalar o modelo

[Baixar o pacote completo para Google Planilhas](../downloads/frota/frota-pacote-google-planilhas.zip). O ZIP contém cópias derivadas das planilhas originais, dados fictícios, manifesto de restauração e instalador. Siga `INSTALACAO-PT.md` dentro do pacote: importe todos os componentes, execute a configuração e autorize as conexões entre suas próprias cópias. Os arquivos XLSX servem como transporte para o Google Planilhas; não são apresentados como sistemas compatíveis com Excel.

## English

### Purpose and components

The project connects **FROTA GEIN — OPERACIONAL → FROTA GEIN — AUXILIARES → PAINÉIS FROTA GEIN**. Operations collect fuel, services, vehicle records and review decisions. The supporting workbook consolidates data and validates readings. Dashboards cover expenses, mileage, consumption, duplicates and station monitoring.

### Use the demonstration

Apply the available vehicle, period and type filters. Indicators, table and chart follow the selection. Open a record for details, edit the available fictional fields and use **Reset examples** to discard changes. Edits stay in the browser session (`sessionStorage`, with temporary memory as a fallback). Nothing is sent to the sources.

### Rules and scope

| Area | Confirmed source rule | Demonstration scope |
| --- | --- | --- |
| Expenses | Fuel and other service amounts; fleet classification. | A fictional selection with identifiable service types. |
| Consumption | Washing is separate; nonpositive distance requires review; below 5 or above 20 km/L creates an alert. | Uses the example’s input km/L; does not treat services as fuel. |
| Repeated refuelling | More than one vehicle refuelling on the same date; weekends flagged. | Records for review, without automatic findings of irregularity. |
| Financial duplicates | Group based on date, driver, vehicle, station, value and type; decisions use stable IDs. | Identifies candidates without implementing the complete native credit workflow. |
| Amount under review | Sum of pending entries in the group, not only the potentially excess amount. | Distinguishes the reviewed amount from any possible duplicate charge. |
| Mileage | Native engine uses the previous valid reading, history, median, limits and reconnections. | Educational delta checks; not a complete engine reproduction. |

In the original, a credit recorded against one occurrence removes its group from the pending financial view. Station history can retain groups already credited. An occurrence does not prove an error, fraud or an improper charge.

The native mileage engine uses only valid readings in monthly calculations. For owned and leased vehicles it allocates valid intervals across months in proportion to the covered time. Other categories use their own interpolation rule. Missing coverage remains blank; mileage after the final reading is not invented. The demo does not implement the historical median, reading reconnection or monthly allocation and cannot replace that processing.

### Files and setup

A usable set requires all three files, the vehicle register and the decision log. This guide and the website code do not replace those dependencies. Use only files listed as available in the downloads section.

To configure native copies: copy operations, supporting calculations and dashboards; update **all** external references, including references outside the connection tabs; authorize operations → supporting calculations → dashboards; check fuel consumption, washing, repeated entries, credits, regressions and an interval crossing the first day of a month.

The original has different row limits by calculation engine and dashboard, plus fixed vehicle and year ranges. A capacity label or healthy connection does not establish complete processing. Files are in Portuguese. Excel compatibility, live geolocation and preventive-maintenance functionality were not confirmed for the inspected set.

### Download and install the model

[Download the complete Google Sheets package](../downloads/frota/frota-pacote-google-planilhas.zip). The ZIP includes copies derived from the original spreadsheets, fictional data, a restoration manifest and setup script. Follow `INSTALLATION-EN.md` inside the package: import every component, run setup and authorize connections between your own copies. The XLSX files transport the models into Google Sheets; they are not presented as Excel-compatible systems.
