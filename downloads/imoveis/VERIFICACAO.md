# Verificação — Imóveis

Pacote demonstrativo para Google Planilhas, preparado a partir de cópias nativas. A comprovação distingue cálculo, transporte e autorização.

## Testes executados

- Inventário e sanitização de todas as 76 abas, inclusive técnicas, ocultas e snapshots. As fontes originais permaneceram sem alterações.
- Teste das fórmulas nativas com entradas fictícias: três imóveis, duas locações, 34 movimentos, total R$ 28.720,00. Importações de teste usaram valores do próprio exemplo em áreas temporárias, para verificar cálculos sem autorizar fontes privadas. As fórmulas de conexão foram restauradas e as áreas temporárias removidas.
- Painéis nativos: total anual e geral R$ 28.720,00; aluguel R$ 19.600,00; demais despesas R$ 9.120,00; média de oito meses R$ 3.590,00; uma anomalia de R$ 450,00; um atraso na data da conferência.
- Exportação Google e reimportação real dos três componentes como Google Planilhas. Os XLSX conservam os componentes XML de estilos, tabelas e gráficos; não foram reconstruídos como novos livros.
- Aplicação real das requisições de restauração emitidas pelo instalador em três cópias de teste. O transporte sem restauração encurtou grades e nomes e omitiu um gráfico; o manifesto corrige essas perdas.
- Leitura após restauração: todas as 4.707 células esperadas conferem exatamente com o plano aplicado, incluindo 4.705 fórmulas e duas referências de configuração.
- Navegação interna: fórmulas de links `#gid` fazem parte do manifesto e seus destinos são remapeados para as novas abas.
- Verificação dos arquivos públicos: nenhum dos 11 identificadores privados nem dos 192 termos de identidade/identificação da fonte pesquisados; nenhum vínculo externo privado nos relacionamentos XML.

## Estrutura conferida

| Componente | Abas | Mesclagens | Regras condicionais | Gráficos | Proteções nativas encontradas |
|---|---:|---:|---:|---:|---:|
| Operacional | 6 | 377 | 1.012 | 0 | 0 |
| Base | 56 | 27 | 93 | 0 | 0 |
| Painéis | 14 | 5.956 | 79 | 14 | 0 |

Contagens, mesclagens, filtros, nomes completos, dimensões, congelamentos e visibilidade foram conferidos após restauração. As regras condicionais foram restauradas a partir das especificações nativas; o Google normalizou alguns intervalos abertos para o limite atual da grade, mantendo o mesmo alcance na grade verificada. Os dois filtros da Base e oito dos Painéis permanecem. A tabela e o intervalo com cores alternadas da Operacional sobreviveram à importação. As 11 definições de validação exportadas da Operacional e 11 seletores dos Painéis foram inspecionados; seletores dos Painéis também são restaurados pelo manifesto.

As especificações dos 14 gráficos incluem títulos, subtítulos, séries, intervalos e posicionamento. A API pode omitir séries na leitura quando os dados ainda estão vazios ou inacessíveis; a renderização final depende da autorização e do recálculo. Não foi feita comparação visual de pixels na conta do destinatário.

## Adaptações registradas

Dados fictícios substituem cadastros, valores, documentos, processos, protocolos e contas. Snapshots foram esvaziados. O módulo Contratos permanece como estrutura técnica sem suas fontes nem dados. Cinco abas de painéis desse tema ficam ocultas. As abas e grades originais foram mantidas, sem reduzir o modelo a uma tabela simples.

Correção funcional: as 60 guardas do resumo mensal de Imóveis B19:F30 foram alteradas de Q para R, onde o modelo já calcula a contagem mensal. A fórmula original ocultava totais apesar de haver lançamentos. A correção foi validada com a soma dos movimentos fictícios.

## Etapas que dependem do destinatário

- Executar o Apps Script na própria conta e conceder as permissões solicitadas.
- Autorizar Operacional → Base e Base → Painéis pelo `IMPORTRANGE`.
- Esperar o recálculo, conferir os totais do guia e testar uma alteração de entrada.

O teste automatizado do instalador e a aplicação das requisições na API não equivalem à aprovação OAuth interativa nem à autorização dos vínculos em outra conta. O estado `complete: true` confirma a aplicação do manifesto. Não confirma essas autorizações.

Não são transportados scripts vinculados, gatilhos, histórico de versões, permissões ou comentários das fontes. Nenhuma compatibilidade funcional com Excel é declarada. Este pacote é um modelo demonstrativo instalável no Google Planilhas.

A instalação inclui `restaurarGraficos`, etapa posterior à autorização e ao carregamento dos dados. Isso recupera estilos de séries que o Google pode omitir quando a origem do gráfico está indisponível. A função não reaplica fórmulas ou dados de entrada.
