# Verificação do pacote Frota

O pacote foi reimportado como três arquivos nativos do Google Planilhas. As requisições de restauração foram aplicadas em cópias de teste e os cálculos foram conferidos com os dados fictícios incluídos. Os arquivos de origem permaneceram sem alterações.

## Estrutura e recursos

| Recurso | Resultado |
|---|---|
| Arquivos e abas | 3 arquivos; 3 + 14 + 9 abas, na ordem do modelo |
| Capacidade das grades | 3.157.042 + 7.080.889 + 3.663.971 células |
| Configuração | pt_BR; America/Sao_Paulo; nomes completos restaurados |
| Fórmulas nativas restauradas | 26 âncoras operacionais, 13.978 células auxiliares, 64 células dos painéis |
| Validações | 30 regras restauradas; sentinelas conferidas no Google Planilhas |
| Formatação condicional | 28 regras preservadas/restauradas |
| Mesclagens | 243 intervalos conferidos |
| Tabelas e faixas alternadas | 2 tabelas e 2 faixas preservadas no operacional |
| Filtros básicos | 2 filtros nos painéis |
| Congelamento, ordem e visibilidade | Conferidos; CONEXÕES dos painéis visível para instalação |
| Gráficos | 10 especificações completas restauradas e verificadas com dados disponíveis |
| Proteções e visualizações de filtro | Nenhuma na estrutura auditada; nenhuma inventada |

A API do Google normalizou três validações para incluir explicitamente o nome da própria aba. Três intervalos de formatação condicional abertos passaram a indicar a última linha da grade existente, mantendo a cobertura atual de 1.000 linhas. No décimo gráfico, uma cor de texto preta representada por objeto vazio foi omitida como padrão; as demais propriedades conferiram após o mapeamento dos identificadores internos. Essas normalizações não foram escondidas na comparação.

O transporte XLSX, sozinho, encurta nomes de abas, reduz grades vazias, altera o fuso e restringe algumas matrizes ao tamanho exportado. O manifesto restaura esses pontos. O Google reconheceu fórmulas próprias no retorno ao formato nativo; o manifesto também repõe as fórmulas originais necessárias, sem substituí-las por resultados fixos. Os arquivos não foram certificados para execução no Excel.

## Cálculos observados no Google Planilhas

| Conferência | Resultado fictício |
|---|---:|
| Registros operacionais | 1.339 |
| Veículos cadastrados | 83 |
| Total financeiro de 2026 | R$ 247.728,20 |
| Financeiro em análise | 6 ocorrências, 3 grupos, R$ 1.079,20 |
| Alertas de consumo no painel | 251: 241 baixos, 1 alto, 9 para conferir hodômetro |
| Serviços de lavagem no operacional | 3 |
| Motor de KM: leituras válidas | 1.332 |
| Motor de KM: leituras suspeitas aguardando confirmação | 4 |
| Motor de KM: leituras anômalas | 3 |
| KM anual no relatório geral | 561.530 km, 75 veículos próprios/alugados |

As 38.831 células de entrada do operacional foram conferidas, e a comparação de 64.272 valores após exportação e reimportação coincidiu. Um lançamento fictício temporário adicional também produziu as 19 colunas derivadas; foi removido depois do ensaio. O registro de duplicidades foi conferido separadamente.

O motor auxiliar distribuiu a quilometragem entre meses conforme a regra original: para o veículo fictício DEMO-001, o total de janeiro a agosto foi 4.880 km, média de 610 km. Os painéis financeiros, de consumo, duplicidades, quilometragem e postos consumiram as saídas fictícias calculadas durante o ensaio.

## Limites da verificação

Para testar os cálculos auxiliares e dos painéis, as conexões externas das cópias descartáveis receberam temporariamente fotografias dos dados fictícios. As fórmulas IMPORTRANGE foram restauradas, e as abas/faixas de ensaio foram removidas ou repostas ao final. Isso comprova os cálculos ensaiados, mas não concede nem comprova autorização de conexão entre arquivos na conta de quem instalar.

Os 10 gráficos foram comparados com as especificações nativas completas do modelo. Como o Google omite ou descarta configurações de séries quando a origem está em erro de conexão, a conferência foi feita com valores fictícios nas faixas dos gráficos e com reaplicação das 30 requisições correspondentes. Execute `restaurarGraficos` depois de autorizar as conexões e aguardar o recálculo.

A restauração foi ensaiada pela API nativa. O instalador também possui verificações locais de planejamento e segurança; a execução completa de autorização em uma conta nova depende do usuário. O visual foi preservado pelo transporte e por especificações nativas conferidas; não foi realizada comparação de imagens pixel a pixel.

Scripts vinculados, gatilhos, histórico de edição, compartilhamentos e autorizações da origem não são transportados. Nenhum desses scripts foi necessário aos resultados de fórmulas observados; o comportamento de automações não acessíveis não foi auditado.

Uma varredura dos XMLs dos três XLSX e dos arquivos textuais do pacote procurou identificadores conhecidos das fontes privadas. O exame também reconstruiu os argumentos de texto de `DUMMYFUNCTION`, pois o transporte pode dividir um endereço em literais concatenados. As fórmulas lógicas foram comparadas com a origem, permitindo apenas as substituições de sanitização; concatenações internas foram preservadas. Foram verificados prefixos de URLs e fragmentos dos IDs privados. O resultado está em `verificacao-frota.json`. Dados pessoais e institucionais foram substituídos por exemplos fictícios; os vínculos usam apenas os IDs que o instalador receber do próprio usuário.

## English

The three files were reimported into native Google Sheets and restoration requests were exercised on test copies. Checks covered 26 tabs, original grid capacity, 30 validation rules, 28 conditional formatting rules, 243 merged ranges, 2 tables, 2 banded ranges, 2 basic filters and 10 full chart specifications. API normalizations are documented above.

The fictional dataset contains 1,339 transactions, totaling R$247,728.20. Pending financial review contains six records in three groups and R$1,079.20. Native consumption and mileage calculations were also exercised. Temporary synthetic inputs and chart fixtures were restored after the tests.

Live IMPORTRANGE authorization in a new user's account remains a manual installation step. Run `restaurarGraficos` after connections and recalculation are ready. Source bound scripts, triggers, permissions and edit history are not included. These XLSX files are Google Sheets transport files, not certified Excel workbooks.
