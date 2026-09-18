# Dependências e utilização das planilhas

**Situação em 18/09/2026:** a estrutura e as regras principais foram inspecionadas. Os downloads são pacotes para importação e restauração no Google Planilhas, com dados fictícios e referências configuradas na conta do visitante. As demonstrações do site usam dados fictícios e funcionam de forma independente.

## Mapa por assunto

| Assunto | Arquivos e abas de origem | Recursos confirmados | Painéis | Componentes necessários |
| --- | --- | --- | --- | --- |
| Obras e Facilities | Operacional de contratos: vigências, pagamentos de serviço/material, aditivos, conferência de aditivos e saldos. Fonte complementar: prestação de serviços e conexão de pagamentos. | Contrato/processo, vigências, empenhos separados, lançamentos, aditivos, saldo e previsão por ciclo financeiro, renovações e histórico. | Contratos, gastos, pagamentos mensais, risco, renovações, previsão e histórico. | **4 arquivos nativos:** fonte complementar temática + operacional + base auxiliar + painéis; guia. |
| Imóveis | Cadastro geral, vigências, Aluguéis, Condomínios, IPTU e Taxas; respectivas importações/cálculos auxiliares. | Imóveis próprios e locados, relação entre cadastro e contrato, quatro naturezas de despesa, vencimentos, protocolos, envio e setor responsável. | Contratos de imóveis, gastos, histórico, lançamentos em atraso e anomalias. | **3 arquivos nativos:** operacional + base auxiliar + painéis; guia. |
| Estacionamento | Recorte dos contratos pelo objeto e identificador; fonte complementar: Estacionamentos e conexão de pagamentos. | Local, vagas registradas, processo, vigência, valor contratado, empenho, competências, documentos, lançamentos e renovação. | Recorte temático das regras de contratos; o painel web próprio é uma adaptação de apresentação. | **4 arquivos nativos:** fonte complementar temática + operacional recortado + base auxiliar + painel; guia de adaptação. |

A base auxiliar é uma camada técnica. Não constitui um sexto projeto. Os temas Frota e Mapa de Preço têm suas próprias dependências, documentadas nos respectivos guias.

### Abas que participam dos fluxos

**Contratos**

- VIGÊNCIAS DO CONTRATO.
- CONFERÊNCIA DE ADITIVOS.
- PAGAMENTOS SERVIÇO e PAGAMENTOS MATERIAL.
- ADITIVOS SERVIÇO e ADITIVOS MATERIAL.
- AUX SALDOS OPERACIONAIS.

**Imóveis**

- RELAÇÃO IMOVEIS GERAIS (o nome original termina em espaço).
- VIGÊNCIAS DO CONTRATO.
- Aluguéis, Condomínios, IPTU e Taxas.

**Base auxiliar**

- CFG PARÂMETROS.
- Importações RAW, transformações LIVE e tabelas IMP por origem/natureza.
- AUX CADASTRO CONTRATUAL e AUX CADASTRO IMÓVEIS.
- AUX MOVIMENTAÇÕES PAGAMENTOS e AUX MOVIMENTAÇÕES ADITIVOS.
- AUX PAINEL CONTRATOS, AUX RISCO INSUFICIÊNCIA e AUX RENOVAÇÃO CONTRATUAL.
- AUX PAGAMENTOS EM ATRASO, PENDÊNCIAS DA FONTE e controles de sincronização/validação.
- As cópias estáticas de contingência foram consideradas na sanitização; consulte o relatório do pacote para as adaptações dessas camadas.

**Painéis**

- PAINEL DE CONTRATOS - OBRAS E FACILITIES.
- PAINEL DE CONTRATOS - IMÓVEIS.
- RESUMO DE GASTOS - OBRAS E FACILITIES.
- RESUMO DE GASTOS COM IMÓVEIS.
- PAGAMENTOS MENSAIS OBRAS E FACILITIES/IMÓVEIS.
- PAINEL RISCO INSUFICIÊNCIA CONTRATUAL.
- PAINEL DE RENOVAÇÕES CONTRATUAIS.
- PAINEL DE PREVISÃO CONTRATUAL.
- HISTÓRICO PAGAMENTOS/ADITIVOS/REPACTUAÇÃO.
- HISTÓRICO PAGAMENTO DE IMÓVEIS.
- LANÇAMENTOS DE IMÓVEIS EM ATRASO.
- ANOMALIAS DE PAGAMENTO DE IMÓVEIS.

A visão de dados bancários não será incluída com informações reais nas versões públicas.

## Dependência complementar encontrada

A operacional de contratos importa uma tabela de conexão de outra planilha de pagamentos. Essa tabela transforma blocos mensais de prestação de serviços e estacionamentos, relacionando origem, processo e contratada à chave contratual.

Ela alimenta lançamentos reais da operacional. Portanto, retirar a ligação ou substituir seu resultado por valores fixos retiraria uma funcionalidade. A cópia pública precisa incluir uma versão temática e sanitizada dessa fonte ou receber uma adaptação expressamente documentada e validada.

A fonte complementar contém quantidades de vagas e um registro sem contrato localizado. Um registro sem vínculo deve permanecer identificado para conferência, sem entrar automaticamente na contagem de contratos válidos.

## O que os indicadores significam

| Campo/indicador | Definição de uso |
| --- | --- |
| Valor contratado | Valor registrado para o contrato; sua periodicidade precisa ser confirmada. |
| Empenho | Base financeira da natureza serviço/material ou aluguel/condomínio. Não é necessariamente igual ao valor contratado. |
| Pagamento lançado | Existe um valor positivo no lançamento. Isso não comprova quitação. |
| Data histórica | Campo histórico opcional; não substitui o significado de um valor lançado nem valida o pagamento. |
| Saldo atual | Empenho + aditivos elegíveis − lançamentos associados ao ciclo. |
| Saldo projetado | Saldo após estimar competências sem lançamento dentro do período financeiro. |
| Risco de insuficiência | Saldo projetado negativo, após arredondamento em centavos. Zero ou valor positivo não representam risco. |
| Renovação | Término atual dentro da janela de acompanhamento de 120 dias, com indicação separada de tramitação. |
| Lançamento de imóvel em atraso | Vencimento passado e ausência de valor positivo lançado. É uma pendência de registro. |
| Anomalia | Informação ausente ou inválida para conferência; não é prova automática de falta de pagamento. |
| Vagas | Quantidade explicitamente registrada; campo ausente não vira zero ou uma vaga. |

Os dados de estacionamento são retirados dos totais de Obras e Facilities no portfólio. Uma empresa com dois contratos continua com dois identificadores. Imóveis se relacionam por identidade cadastral/contratual e local, preservando a composição aluguel, condomínio, IPTU e taxas.

## Ordem de configuração das cópias

Baixe o ZIP completo do módulo e siga `INSTALACAO-PT.md`. O instalador configura as referências entre os componentes informados por você; a autorização de acesso continua sendo feita no Google Planilhas.

1. Crie uma pasta própria no Google Drive, importe cada XLSX do pacote como Google Planilhas e execute o instalador incluído.
2. Para Obras e Estacionamento, configure primeiro a fonte complementar temática. Confira processos, contratos, vagas e status do vínculo.
3. Abra a operacional temática. Cadastre identidade, objeto, vigências, valores e a separação de naturezas. Registre movimentações nas competências corretas.
4. Abra a base auxiliar e aponte os parâmetros e as referências externas para as cópias criadas na sua conta.
5. Autorize cada conexão IMPORTRANGE solicitada pelo Google Planilhas. Não conecte o pacote a uma planilha operacional privada do autor.
6. Aponte as referências dos painéis para a base auxiliar da mesma cópia.
7. Confira um contrato e suas movimentações ponta a ponta, incluindo uma competência sem lançamento e uma com lançamento. Para imóveis, confira separadamente cada tipo de despesa.
8. Confira também um contrato encerrado, uma renovação em tramitação, um registro sem vínculo e os limites de saldo negativo/zero/positivo.
9. Só utilize os resultados após a verificação de vínculos, totais, pendências e permissões das cópias.

Nas fontes inspecionadas, parte da camada de vigências usa valores fixos. A indicação de conexão ou uma hora de recálculo não comprova que toda a base se atualizou. Essa limitação precisa permanecer visível até ser tratada em uma adaptação documentada.

## Distribuição e verificação

Os pacotes incluem a estrutura derivada das fontes, com entradas fictícias e manifesto de restauração. As fórmulas que exigem recursos nativos são restauradas como fórmulas pelo instalador. O relatório de cada pacote discrimina os resultados dos testes de importação e cálculo, os recursos preservados e as adaptações.

As fontes e suas permissões não foram alteradas. A distribuição usa ZIPs no repositório; não depende de tornar pública a conta Google do autor. As cópias importadas pelo visitante precisam da autorização normal de IMPORTRANGE. Essa autorização entre arquivos não foi automatizada nem é comprovada pelo estado `complete: true` do instalador.

Projetos Apps Script vinculados, gatilhos e permissões originais não são transportados por XLSX e não fazem parte dos pacotes. Os testes documentados cobrem as funções de planilha descritas nos respectivos relatórios. Não se afirma preservação de automações de script não inspecionadas.

## Excel e downloads

As exportações de contratos, base e painéis converteram diversas fórmulas para funções de compatibilidade `__xludf.DUMMYFUNCTION`. A exportação também altera nomes de abas para os limites do Excel. Um arquivo que abre mostrando valores em cache não demonstra cálculo funcional.

Por isso, os XLSX são oferecidos dentro dos ZIPs como arquivos de transporte, acompanhados de restauração para Google Planilhas. Não são anunciados como sistemas para execução no Excel. A planilha original de Mapa de Preço possui um fluxo próprio de compatibilidade e deve conservar seu formato necessário.

Os arquivos de código, guias e dados fictícios das demonstrações web podem ser distribuídos independentemente. Eles não substituem o pacote de planilhas.

## Limites do site

As demonstrações permitem explorar exemplos fictícios. Filtros, indicadores e detalhes atuam nesses exemplos. Quando houver edição local, sua forma de persistência e a ação de restaurar estarão indicadas na interface.

Não há gravação nas fontes, sincronização em tempo real ou confirmação bancária. O idioma do site pode mudar; o idioma dos arquivos de planilha permanece informado separadamente. Reais não são convertidos automaticamente para outra moeda.

