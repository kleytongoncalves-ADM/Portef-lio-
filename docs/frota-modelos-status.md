# Modelos de Frota / Fleet models

## Português

O pacote completo contém três arquivos derivados das planilhas originais: operacional, auxiliares e painéis. O download inclui os XLSX de transporte, manifesto de restauração, instalador e guias em português e inglês. As 26 abas e os 10 gráficos pertencem à estrutura de origem; as entradas são fictícias.

Siga `INSTALACAO-PT.md` dentro do ZIP para importar os arquivos no Google Planilhas, restaurar fórmulas e propriedades e autorizar as conexões entre suas cópias. Não é um pacote para executar no Microsoft Excel.

Nos testes nativos com dados fictícios, os 1.339 registros totalizaram R$ 247.728,20. A conferência de duplicidades encontrou seis ocorrências em três grupos, somando R$ 1.079,20 em análise. As regras de consumo e quilometragem foram conferidas no operacional, nos auxiliares e nos painéis. O relatório dentro do pacote discrimina a restauração e os testes.

A validação das camadas de cálculo usou entradas temporárias de teste nas cópias de teste; as fórmulas de importação foram restauradas ao final. A autorização de IMPORTRANGE precisa ser feita na conta de quem instalar. Depois do recálculo, execute `restaurarGraficos` para reaplicar os estilos das séries com dados disponíveis. O instalador não concede essa autorização e sua conclusão não certifica o recálculo. Scripts vinculados e gatilhos da origem não são incluídos.

[Baixar pacote completo](../downloads/frota/frota-pacote-google-planilhas.zip).

## English

The complete package contains three workbooks derived from the originals: operations, supporting calculations and dashboards. It includes XLSX transport files, a restoration manifest, setup script and bilingual instructions. The 26 tabs and 10 charts come from the source structure; the entries are fictional.

Follow `INSTALLATION-EN.md` inside the ZIP to import the files into Google Sheets, restore formulas and properties, and authorize connections between your copies. This is not a package for execution in Microsoft Excel.

Native tests with fictional data produced 1,339 records and R$247,728.20 in total expenditure. Duplicate review found six entries in three groups, with R$1,079.20 under review. Consumption and mileage rules were checked in operations, supporting calculations and dashboards. The package report describes restoration and testing.

Calculation-layer validation used temporary test inputs in test copies; import formulas were restored afterward. IMPORTRANGE authorization must be granted in the installer's own account. After recalculation, run `restaurarGraficos` to reapply series styling with data available. The setup script does not grant that authorization, and completion does not certify recalculation. Bound source scripts and triggers are not included.

[Download complete package](../downloads/frota/frota-pacote-google-planilhas.zip).
