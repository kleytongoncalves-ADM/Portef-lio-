# Validação e limites / Validation and limits

## Português

### Arquivos e cálculos

- Os quatro pacotes para Google Planilhas derivam das fontes indicadas pelo autor. Contêm as operacionais, auxiliares, painéis e, em Obras/Estacionamento, a fonte complementar temática de pagamentos. As entradas de demonstração são fictícias.
- Os componentes foram importados em cópias nativas de teste. Foram conferidos fórmulas, dimensões, nomes de abas e recursos de apresentação; o manifesto restaura o que a conversão altera. Os relatórios dentro dos ZIPs registram os recursos e as adaptações de cada pacote.
- Frota: 1.339 registros, R$ 247.728,20 de despesas e R$ 1.079,20 em seis ocorrências de duplicidade financeira. Regras de consumo, quilometragem e indicadores conferidas nas camadas de cálculo.
- Imóveis: três imóveis fictícios, 34 movimentos e R$ 28.720,00, reconciliados entre naturezas e painéis. Correção documentada da guarda de exibição no resumo mensal.
- Obras e Estacionamento: fonte complementar, chaves contratuais, operacional, aditivos, saldos, projeção e painel exercitados com movimentos fictícios. Os valores esperados e a separação temática constam nos respectivos guias.
- Os testes entre camadas usaram entradas temporárias de teste nas cópias de teste; as fórmulas de importação foram restauradas após a conferência. Isso testa as regras de cálculo, mas não substitui a autorização de IMPORTRANGE na conta do visitante.
- As cópias públicas foram verificadas quanto a dados institucionais, pessoais, bancários, documentos, IDs das fontes e caches. Os originais permanecem separados dos arquivos de distribuição.
- Mapa de Preço: XLSM sanitizado com 40 fórmulas, 167 mesclagens, estilos e regras condicionais preservados. Relatório e hashes em `downloads/precos/`.

### Site e instalador

- Os cinco projetos têm demonstração, guia bilíngue e links de download no catálogo do site.
- Os testes Node verificam as regras das demonstrações, rotas, arquivos, traduções e o instalador: remapeamento de IDs, retomada, marcadores atômicos, limites temporários, grades, gráficos e separação das mudanças de configuração regional das escritas de fórmulas.
- `python3 tools/check-packages.py` verifica integridade dos ZIPs e XLSX, correspondência entre abas e manifestos, componentes, presença dos gráficos ou sua restauração, ausência de URLs privadas e igualdade do instalador empacotado com a versão do repositório.

### Limites que permanecem

- **Autorização das conexões:** requer a ação normal de permitir acesso entre as cópias no Google Planilhas. A revisão automática do navegador bloqueou essa mudança na sessão de conferência. O instalador não contorna a autorização; `complete: true` confirma aplicação dos lotes, não autorização ou recálculo.
- **Excel:** os quatro pacotes conectados precisam do Google Planilhas. Seus XLSX são arquivos de transporte. O XLSM de Mapa de Preço ainda não foi executado no Microsoft Excel; inconsistências herdadas constam no seu guia.
- **Scripts e permissões:** Apps Script vinculados, gatilhos e permissões das fontes não são transportados pelo XLSX. Não se afirma preservação de automações não inspecionadas.
- **Navegador:** a revisão visual/interativa completa do site em computador e celular não foi concluída. A ferramenta de navegador não acessou o servidor local.
- **Publicação:** código e arquivos no GitHub não comprovam ativação do GitHub Pages. Consulte a URL e o status em Settings → Pages antes de divulgar o site publicado.

### Conferência após publicar

Abra as cinco páginas em computador e celular; confira os menus por teclado, troca de idioma, filtros, edição e restauração dos exemplos. Baixe os pacotes, siga a instalação e confira um lançamento de cada natureza até o painel. Não preencha dados de produção antes de concluir essa configuração.

## English

The four Google Sheets packages derive from the author's original workbooks and include the connected components, fictional inputs, a restoration manifest, setup script and bilingual instructions. Native test copies were used to verify calculations and restoration. Package reports describe the tested resources and documented changes.

Fleet tests covered 1,339 transactions totaling R$247,728.20 and six financial duplicate candidates totaling R$1,079.20. Property tests reconciled 34 entries totaling R$28,720 across the expense categories and dashboards. Facilities and Parking tests covered their payment source, contract keys, operational calculations, amendments, balances, projections and dashboard outputs.

Cross-layer tests used temporary fictional inputs in test copies, then restored import formulas. They do not certify IMPORTRANGE authorization in the visitor's account. Automatic browser approval review blocked that permission change during this session; the setup script does not bypass it. Completion confirms restoration batches, not authorization or recalculation.

Node tests cover demonstration rules, site integrity, translations and setup behavior. The package checker verifies ZIP/XLSX integrity, manifest consistency, required components, dashboard charts or their restoration, private-link checks and the exact packaged installer version.

The four connected packages require Google Sheets; their XLSX files are transport files. Native Microsoft Excel execution of the price-comparison XLSM remains untested. Bound source scripts, triggers and permissions are not transported. Full desktop/mobile website validation and GitHub Pages activation have not been confirmed. The original workbooks were not edited.
