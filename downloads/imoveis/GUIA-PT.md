# Imóveis — modelo original para Google Planilhas

Este pacote contém três componentes derivados de cópias nativas do modelo de referência, com dados fictícios: **Operacional (6 abas), Base (56 abas) e Painéis (14 abas)**. Mantém a organização original de cadastros, vigências, aluguéis, condomínios, IPTU, taxas e consultas. As abas técnicas compartilhadas com Contratos permanecem no arquivo; suas entradas estão vazias e os painéis desse outro tema ficam ocultos.

Os XLSX são arquivos de transporte para **importar no Google Planilhas e restaurar com o instalador**. Não são uma edição compatível com Excel. Funções matriciais, conexões e nomes completos precisam da instalação. Antes dela, podem aparecer `#REF!`, funções de transporte e resultados vazios.

## Conteúdo

| Arquivo | Chave no instalador | Função |
|---|---|---|
| MODELO-PUBLICO-IMOVEIS-OPERACIONAL.xlsx | `operacional` | Cadastros e lançamentos |
| MODELO-PUBLICO-IMOVEIS-BASE.xlsx | `base` | Importações, vínculos, cálculos e conferência |
| MODELO-PUBLICO-IMOVEIS-PAINEIS.xlsx | `paineis` | Consultas e gráficos |
| manifesto-imoveis.json | — | Restauração das fórmulas e propriedades |
| ConfigurarModelos.gs e appsscript.json | — | Instalador auditável para sua conta |

## Instalação

Siga **INSTALACAO-PT.md** do ZIP. Importe os três XLSX como arquivos nativos, envie também `manifesto-imoveis.json` ao seu Drive e mantenha os nomes dos componentes sem a extensão `.xlsx` durante a configuração.

No instalador, as chaves são:

```javascript
IDS: {
  operacional: 'ID_DA_SUA_COPIA_OPERACIONAL',
  base: 'ID_DA_SUA_COPIA_BASE',
  paineis: 'ID_DA_SUA_COPIA_PAINEIS'
}
```

Execute `prepararInstalacao`, confira os três destinos, preencha a confirmação exibida e execute `executarInstalacao` até `complete: true`. O instalador pode precisar de mais de uma execução. Ele restaura fórmulas nativas, nomes completos, grades, fusos, mesclagens, regras condicionais, filtros, seletores, gráficos e links internos registrados no manifesto.

## Conectar os componentes

A sequência é **Operacional → Base → Painéis**. A permissão de `IMPORTRANGE` deve ser concedida na sua conta; o instalador não a concede.

1. Na Base, localize `CFG PARÂMETROS!E4` ou o `IMPORTRANGE` de uma aba `RAW I`. Se aparecer o botão **Permitir acesso**, autorize a Operacional.
2. Nos Painéis, autorize a Base em uma célula de importação. Em `PAINEL DE CONTRATOS - IMÓVEIS`, a importação está em `AB1`, na área auxiliar.
3. Se o botão não aparecer porque a fórmula envolve outras funções, crie uma aba temporária no arquivo de destino e digite em A1 `=IMPORTRANGE("ID_DA_ORIGEM";"A1")`. Use o ID da Operacional quando estiver na Base; use o ID da Base quando estiver nos Painéis. Clique em **Permitir acesso** e depois exclua a aba temporária.
4. Aguarde o recálculo. Não conecte este modelo a arquivos institucionais para testar a demonstração.

## Conferir o exemplo

O exemplo tem três imóveis fictícios, duas locações e movimentos de janeiro a agosto de 2026. Depois de conectar:

| Conferência | Resultado esperado |
|---|---:|
| Movimentos, incluindo um lançamento sem valor | 34 |
| Aluguéis lançados | R$ 19.600,00 |
| Condomínios lançados | R$ 6.000,00 |
| IPTU lançado | R$ 2.700,00 |
| Taxas lançadas | R$ 420,00 |
| Total geral | R$ 28.720,00 |
| Anomalia de vencimento ausente | 1, associada a R$ 450,00 |

Há também um aluguel de junho sem valor lançado, para demonstrar o painel de atrasos. Quantidades e dias de atraso, vigência e renovação dependem da data de referência. Na conferência em setembro de 2026, havia um atraso. Na seleção de ano **2026**, o resumo anual deve mostrar R$ 28.720,00; a média dos oito meses encerrados com lançamentos era R$ 3.590,00.

Faça um teste simples: altere temporariamente o aluguel de janeiro de Local Alfa de R$ 1.200 para R$ 1.300. Após o recálculo, o total geral deve subir R$ 100. Restaure R$ 1.200 em seguida. Edite as entradas da Operacional; as abas de Base e as áreas auxiliares dos Painéis contêm fórmulas.

## Adaptações e limites

Foram removidos nomes reais, endereços, dados bancários, identificadores, notas, comentários, vínculos com fontes privadas e snapshots. As entradas demonstrativas são consistentes entre os três arquivos. Textos e exceções de validação que citavam registros reais foram substituídos por exemplos. A fonte complementar de Contratos não é necessária neste módulo.

Uma correção pontual foi necessária no modelo: no resumo mensal de Imóveis, as 60 fórmulas de B19:F30 consultavam Q19:Q30 vazias. Passaram a consultar a contagem existente em R19:R30. A regra de cálculo foi mantida; a correção permite exibir os totais mensais.

A importação e a aplicação das requisições foram testadas em cópias Google Planilhas. A autorização entre arquivos e a execução interativa do Apps Script na conta do destinatário continuam sendo etapas de instalação. Scripts vinculados, gatilhos, permissões e autorizações das fontes não são transportados. O único código incluído é o instalador. Consulte **VERIFICACAO.md** para o alcance dos testes.

## Acabamento dos gráficos

Depois de autorizar as conexões e aguardar os dados, execute `restaurarGraficos` no Apps Script. Essa função reaplica somente as definições originais dos gráficos, preservando entradas e fórmulas. O Google pode descartar cores e rótulos ao configurar gráficos enquanto suas fontes ainda estão em `#REF!`.
