# Mapa de Preço / Price Comparison

## Português

### Modelo de origem

O modelo analisado é um arquivo **XLSM**, com uma aba visível, **PESQUISA DE PREÇO**. Possui espaço para treze itens, três referências de mídia, três propostas de fornecedores, média e mediana por item e um resumo de peças, serviços e total de manutenção. O resumo faz parte da mesma aba.

A extensão XLSM foi preservada. A inspeção do pacote não encontrou projeto VBA, conexões externas, gráficos ou tabelas dinâmicas. Isso descreve a cópia analisada; não equivale a teste de execução e recálculo no Microsoft Excel.

### Usar a demonstração

1. Explore os itens fictícios e as referências de mídia.
2. Edite valores nas referências e nas propostas para observar a comparação.
3. Deixe um campo vazio para verificar a sinalização de proposta incompleta. Zero informado é diferente de campo vazio.
4. Consulte separadamente peças e serviços e restaure os exemplos quando desejar.

As quantidades do exemplo são fixadas em **1** para manter comparáveis valores unitários e totais. O recorte web não reproduz todas as treze posições do modelo. A comparação final usa apenas propostas completas no escopo demonstrado e não elege vencedor nem calcula uma “economia” presumida.

Edições ficam na sessão do navegador, em `sessionStorage`, com memória temporária como alternativa. Nada é enviado ao arquivo original.

### Pontos de atenção nas fórmulas originais

- Algumas médias e medianas usam os totais de mídia; outras usam os valores unitários. Com quantidades diferentes de um, a soma mistura bases. A cópia preservada mantém essas fórmulas e este achado precisa ser conferido antes de uso real.
- No arquivo recebido, resultados armazenados de médias e medianas apresentavam erros com as entradas vazias. Não substitua esses erros por zeros para aparentar dados completos.
- Os totais dos fornecedores somam peças e depois serviços. Entradas vazias somadas como zero não transformam uma proposta incompleta em cotação gratuita.
- A formatação condicional compara peças com a soma das medianas. Isso não constitui regra de adjudicação, ranking ou exclusão de valores discrepantes.
- O original não calcula automaticamente quantidade × valor unitário em todos os campos. Confira a base e a unidade de cada entrada.

### Baixar e preencher

Use a cópia pública **mapa-preco-modelo-publico.xlsm**, disponível na área de downloads, acompanhada deste guia. A sanitização troca identificadores e identidade institucional por conteúdo demonstrativo; não deve alterar fórmulas, posições, estilos ou a estrutura funcional.

Abra a cópia XLSM em uma aplicação compatível e confira o recálculo com valores controlados. Comece por itens de quantidade um, verifique média, mediana, peças e serviços, e só depois adapte o preenchimento. Para outras quantidades, resolva expressamente a diferença de base antes de usar o resumo. Não habilite recursos inexistentes apenas por causa da extensão do arquivo.

O arquivo está em português e os valores são em **reais brasileiros (BRL)**. A versão inglesa do site não altera a moeda, o idioma das abas ou as fórmulas da planilha.

## English

### Source model

The inspected model is an **XLSM** file with one visible sheet, **PESQUISA DE PREÇO**. It has room for thirteen items, three published references, three supplier quotations, an item-level mean and median, and a summary of parts, services and total maintenance cost. The summary is on the same sheet.

The XLSM extension is preserved. Package inspection found no VBA project, external connections, charts or pivot tables. This describes the inspected copy; it does not amount to an execution and recalculation test in Microsoft Excel.

### Use the demonstration

1. Explore the fictional items and published references.
2. Edit reference and quotation values to observe the comparison.
3. Leave a field blank to see an incomplete quotation flagged. An entered zero differs from a blank field.
4. Review parts and services separately and reset the examples whenever needed.

Example quantities are fixed at **1** so unit and total amounts remain comparable. The web selection does not reproduce all thirteen positions in the model. Final comparisons use only complete quotations within the demonstrated scope and do not select a winner or calculate assumed savings.

Edits stay in the browser session in `sessionStorage`, with temporary memory as a fallback. Nothing is sent to the original workbook.

### Findings in the original formulas

- Some means and medians reference published totals; others reference unit values. For quantities other than one, the sum mixes calculation bases. The preserved copy retains those formulas, so this finding requires review before real use.
- In the supplied file, cached mean and median results contained errors when inputs were blank. Do not replace these errors with zeros to make data appear complete.
- Supplier totals sum parts and then services. Blank inputs summed as zero do not make an incomplete quotation a free offer.
- Conditional formatting compares parts with the sum of medians. This is not an award, ranking or statistical outlier-exclusion rule.
- The original does not automatically calculate quantity × unit price for every field. Check the basis and unit of each entry.

### Download and complete

Use the public copy **mapa-preco-modelo-publico.xlsm**, available in the downloads section, together with this guide. Sanitization replaces identifiers and institutional identity with demonstration content; it should not change formulas, positions, styles or the functional structure.

Open the XLSM copy in a compatible application and check recalculation with controlled values. Start with quantity-one items, verify mean, median, parts and services, and then adapt the entries. For other quantities, explicitly resolve the calculation-basis difference before relying on the summary. Do not enable nonexistent features simply because of the file extension.

The workbook is in Portuguese and amounts are in **Brazilian reais (BRL)**. Selecting English on the website does not change the currency, worksheet language or spreadsheet formulas.
