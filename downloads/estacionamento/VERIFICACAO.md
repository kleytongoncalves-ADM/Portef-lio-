# Verificação — Estacionamento

- Os quatro componentes foram realmente importados como Google Planilhas em cópias privadas de teste. Foram aplicados 80 lotes reais do instalador e um lote adicional com as 179 requests de restauração de mesclagens agora incluídas no manifesto. Não ocorreram erros nessas chamadas.
- Os nomes completos, a visibilidade e as dimensões das 80 abas foram conferidos após a instalação. As 16 regras de validação presentes foram amostradas em células nativas: todas continuam disponíveis. Mesclagens finais OP/AUX/DASH/EXTRA: 179/27/5.956/35; regras condicionais: 1.409/93/79/9. O importador havia reduzido as mesclagens do painel a 875; o manifesto corrige essa perda.
- Conferência independente de fidelidade dos transportes: estilos originais, mesclagens, formatação condicional, validações, congelamentos, dimensões de colunas e proteção XML preservados nas abas retidas. Nomes técnicos de filtros mantidos; critérios privados retirados.
- Quatorze gráficos conferidos no arquivo transportado e nos metadados nativos com `charts_only`; caches antigos removidos. O manifesto contém as especificações nativas completas, posições e bordas. Após autorizar as conexões e carregar dados, `restaurarGraficos()` reaplica essa apresentação; o Google pode descartar opções de série enquanto as fontes exibem erros de importação.
- Conferência independente de privacidade cruzou nomes, documentos, contratos, processos, dados bancários, URLs e fórmulas contra as fontes. Duas pendências com dados específicos da fonte e quatro entradas aritméticas com valores reais foram retiradas.
- Teste do cálculo real: entrada complementar → matriz operacional → base de cálculo → painel contratual. Os números esperados estão no guia. Foram verificadas a normalização por contrato, a separação entre serviço e material, o aditivo fictício, os saldos, projeção positiva sem risco e tabela vazia de risco.
- Importar sozinho pode alterar limites e referências de fórmulas. O manifesto restaura dimensões, nomes completos e âncoras nativas; por isso a instalação é obrigatória. Configuração regional temporária deve ser aplicada antes do lote de fórmulas, não na mesma chamada.

## Limites da verificação

As conexões IMPORTRANGE não foram autorizadas no navegador. Os testes usaram snapshots fictícios temporários nas cópias de validação, sem consultar dados institucionais e sem editar originais. A configuração e o recálculo integral das cópias finais do visitante exigem a sequência do guia. Nenhum sucesso de instalação significa autorização automática dessas conexões.

A proteção existente nos transportes foi preservada; não se verificou equivalência de listas de editores de intervalos protegidos após a conversão. Scripts vinculados, gatilhos e permissões de compartilhamento não são copiados por XLSX. A inspeção visual foi estrutural e pelos formatos nativos; não houve sessão de navegador autenticada para revisar todas as telas.
