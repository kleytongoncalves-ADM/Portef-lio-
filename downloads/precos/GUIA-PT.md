# Mapa de Preço — guia de utilização

Este pacote contém uma cópia pública sanitizada do modelo original de pesquisa em mídia especializada e comparação com três fornecedores. A estrutura foi preservada. O arquivo continua em `.xlsm`; esta cópia não contém projeto VBA.

**Leia as limitações antes de usar os resultados. Há fórmulas originais que alternam valores unitários e totais, além de erros enquanto não há cotações. Essas fórmulas não foram corrigidas na sanitização.**

## Conteúdo

- `mapa-preco-modelo-publico.xlsm`: modelo individual, com uma aba `PESQUISA DE PREÇO` e 13 posições de itens.
- `GUIA-PT.md` e `GUIDE-EN.md`: instruções e limitações nos dois idiomas.
- `VERIFICACAO.md` e `verificacao.json`: registro da preservação e da remoção de identificadores.
- `previa-modelo-publico.png`: prévia do layout da cópia pública. O renderizador usa seu próprio cálculo; mensagens de erro e valores exibidos em células vazias podem diferir dos caches do arquivo e do Excel.

Não há arquivo auxiliar nem painel separado necessário ao uso. O resumo original está na própria aba. O painel interativo do site é uma demonstração distinta com dados fictícios; não sincroniza com este arquivo.

## Como começar

1. Baixe e extraia o ZIP, ou baixe o XLSM e os guias individualmente.
2. Abra uma cópia do XLSM no Excel e mantenha a extensão `.xlsm` ao salvar. Não precisa conectar nenhuma conta, planilha privada ou serviço externo. Esta cópia não exige habilitar macros porque não contém VBA.
3. Informe o processo em B4, o objeto em C4 e a data da pesquisa no título E4. Ajuste os títulos de peças e serviços em M4 e M35.
4. Identifique cada item no campo ao lado do número, na coluna C, e informe a quantidade na coluna D. Cada item ocupa duas linhas; o primeiro começa na linha 7, o segundo na 9, até a linha 31. O modelo não tem uma coluna própria e inequívoca para unidade: informe a unidade na descrição e mantenha-a igual em todas as propostas comparadas.
5. Nas linhas pares 8, 10, 12 até 32, preencha E/F, G/H e I/J com os valores unitários/totais das três referências de mídia. Os totais dessas fontes são entradas; não há fórmula de quantidade × preço nessas colunas. Confira a multiplicação antes de transcrever.
6. Identifique as três propostas nos respectivos cabeçalhos e preencha os valores totais dos itens nas áreas M/N, O/P e Q/R. Respeite as células mescladas; preencha apenas a célula superior esquerda quando houver mesclagem.
7. Informe os serviços em N37, P37 e R37. As fórmulas B39, D39 e F39 somam cada serviço ao total das peças do fornecedor correspondente.
8. Confira as referências das estatísticas, o escopo, a unidade, a quantidade e a completude das propostas antes de comparar os totais. Guarde evidência das fontes usadas junto à sua cópia.

## O que o modelo calcula

| Células | Cálculo original |
|---|---|
| K/L nas linhas pares 8–32 | Média e mediana de três valores da mídia |
| K34/L34 | Soma das médias e das medianas |
| M34/O34/Q34 | Soma das peças de cada fornecedor |
| B37/D37/F37 | Total de peças espelhado para comparação |
| B39/D39/F39 | Peças + serviço de cada fornecedor |

A formatação condicional em B37/D37/F37 compara cada total de peças com L34: verde quando menor ou igual, vermelho quando maior. Ela não escolhe vencedor nem avalia qualidade, habilitação, escopo ou regularidade da proposta.

## Limitações específicas preservadas

**Bases diferentes nas estatísticas.** Nas linhas 8, 18, 20, 22 e 28, média e mediana usam F/H/J, que são valores totais. Nas linhas 10, 12, 14, 16, 24, 26, 30 e 32, usam E/G/I, que são valores unitários. Quando quantidades diferem de 1, somar essas referências pode misturar grandezas. Exemplo: com preços unitários 100/120/140 e totais 200/240/280, a linha 8 usa média 240 e a linha 10 usa média 120. A cópia pública mantém esse comportamento para não alterar o trabalho original silenciosamente. Uma revisão funcional é necessária antes de usar esses resumos em uma decisão real.

**Entradas vazias.** O arquivo recebido já tem 28 células com erros armazenados: médias sem cotações, medianas sem cotações e seus dois totais. O aplicativo usado ao abrir pode recalcular e mudar a mensagem. Não interpretar erro como zero ou resultado válido.

**Propostas incompletas.** SUM retorna zero para fornecedores sem valores e soma parcialmente propostas com itens faltantes. Zero exibido não significa cotação gratuita. Compare apenas propostas com todos os itens e serviços necessários preenchidos, com o mesmo escopo, unidade e quantidade. Ausência de cotação permanece ausência; não preencha com zero para tornar a proposta aparentemente menor.

**Recursos ausentes.** O modelo não tem validações de entrada, proteção ativa da aba, filtros, gráficos, conexões externas ou cálculo de menor preço/ranking. Não há sistema de histórico ou registro automático da fonte. Os campos são editáveis, inclusive células de fórmula; evite sobrescrevê-las.

## Preservação, privacidade e compatibilidade

As 40 fórmulas, 167 mesclagens, duas regras condicionais, estilos, larguras, linhas e parâmetros de impressão foram mantidos. Foram substituídos seis títulos/identificadores, removidos a marca institucional e os metadados pessoais. Não foram publicados placa, processo, objeto real ou nome de terceiro encontrado na autoria do arquivo.

A verificação comparou o conteúdo interno do original e da cópia pública. Houve um teste de cálculo com entradas fictícias em uma cópia temporária, que não foi salva como modelo. Não houve execução em Microsoft Excel, nem validação de importação no Google Planilhas. Importar o XLSM no Google Planilhas pode mudar layout, fórmulas ou formatos; essa conversão não é a versão fiel oferecida neste pacote.

