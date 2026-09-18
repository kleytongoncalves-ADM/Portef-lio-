# Arquitetura dos projetos / Project architecture

## Português

Este documento apresenta o caminho das informações e o limite de cada entrega. Usa somente títulos de fontes, nomes de abas e regras; não contém links privados, identificadores de arquivos nem dados operacionais reais.

### Mapa dos cinco assuntos

| Assunto | Fontes e abas principais | Recursos confirmados | Visão gerencial | Conjunto necessário |
| --- | --- | --- | --- | --- |
| Obras e Facilities | GESTÃO CONTRATOS OBRA E FACILITIES OPERACIONAL: VIGÊNCIAS DO CONTRATO, PAGAMENTOS SERVIÇO, PAGAMENTOS MATERIAL, ADITIVOS SERVIÇO, ADITIVOS MATERIAL, CONFERÊNCIA DE ADITIVOS | Ciclos, naturezas, saldos, aditivos e renovação | Contratos, gastos, pagamentos, previsão, risco, renovação e histórico | **4 arquivos:** fonte complementar temática de pagamentos, operacional sem estacionamento, Base Auxiliar GEIN e painéis temáticos |
| Imóveis | GESTÃO DE IMÓVEIS OPERACIONAL: RELAÇÃO IMOVEIS GERAIS, VIGÊNCIAS DO CONTRATO, Aluguéis, Condomínios, IPTU, Taxas | Cadastro, vínculo próprio/locado, naturezas e vencimentos | Contratos, gastos, histórico, atraso de lançamento e anomalias | **3 arquivos:** operacional, cadastro e normalização da Base Auxiliar GEIN, painéis de imóveis |
| Frota | FROTA GEIN — OPERACIONAL: BASE ABASTECIMENTOS E SERVIÇOS, REGISTRO DUPLICIDADE, CONFIGURAÇÕES E CADASTROS; FROTA GEIN — AUXILIARES | Financeiro, consumo, validação KM, duplicidades e histórico de postos | PAINÉIS FROTA GEIN: financeiro, evolução e relatório KM, consumo, duplicidades e postos | Operacional + Auxiliares + Painéis, com todas as referências próprias |
| Estacionamento | Recorte pelo OBJETO na operacional geral de contratos e movimentos vinculados | Contratos, locais, vigências, lançamentos e vagas quando registradas | Painel web temático adaptado; fonte usa visões contratuais gerais | **4 arquivos:** fonte complementar temática de pagamentos, operacional temática, base auxiliar e painel do recorte |
| Mapa de Preço | Modelo comparativo XLSM: PESQUISA DE PREÇO | Mídia, média, mediana, propostas, peças e serviços | Resumo na própria aba; painel web do recorte fictício | XLSM preservado e guia de uso e limitações |

### Caminho dos dados

Obras e Facilities e Estacionamento possuem uma dependência anterior à operacional: **2026 - Gestão de Pagamento de Energia, Água e Imóveis - CREA**, com as abas **Prestação de serviços**, **Estacionamentos** e **CONEXÃO GEIN**. A conexão normaliza blocos mensais e relaciona a origem à chave contratual. Cada pacote precisa do recorte temático dessa fonte complementar. Registros sem vínculo contratual continuam identificados para conferência. A ordem é fonte complementar → operacional → base auxiliar → painéis.

Nos contratos e imóveis, a operacional alimenta camadas de importação (**RAW**), normalização (**LIVE**), importações consolidadas (**IMP**) e auxiliares (**AUX**). Os painéis consultam saídas dessas camadas. Existem também snapshots estáticos de contingência. A **Base Auxiliar GEIN é infraestrutura compartilhada**, não um sexto projeto de negócio.

Na frota, a operacional fornece registros e cadastros; Auxiliares valida e consolida; os painéis consultam essas saídas. Há referências externas também fora das abas de conexões. No Mapa de Preço, entradas e resumo coexistem em uma única aba, sem dependência externa encontrada na inspeção.

### Identidade e separação

- Contratos usam identificadores consistentes e vigências; empresa sozinha não é chave suficiente.
- Movimentos preservam natureza, competência e vínculo contratual. Registros fora da vigência permanecem identificáveis.
- Imóveis usam sua identidade cadastral e suas relações contratuais.
- Estacionamento é classificado pelo objeto e separado de Obras e Facilities para evitar dupla contagem.
- Frota mantém cadastro, aliases e decisões por identidade estável. A posição da linha não substitui o ID da ocorrência.
- Todas as identidades da demonstração são fictícias. Não há ligação com registros privados.

### O que cada entrega representa

| Entrega | Finalidade | Limite |
| --- | --- | --- |
| Página do projeto | Explicar a solução e seus recursos verificados | Não é a planilha utilizável |
| Demonstração e painel web | Explorar um recorte de regras com dados fictícios | Não reproduz integralmente os motores nativos |
| Cópia nativa preservada | Usar a estrutura do trabalho original | Só pode ser oferecida após sanitização e verificação de dependências |
| Guia | Explicar uso, conexões e achados | Não substitui um arquivo operacional ou painel |

### Regras de publicação e manutenção

As fontes institucionais não são links públicos de demonstração. Cópias nativas devem remover dados privados de entradas, notas, propriedades, fórmulas literais, cadastros, caches e abas ocultas. Todas as referências precisam apontar apenas para os componentes públicos do mesmo conjunto, e a conferência deve ocorrer antes de compartilhar.

O site centraliza textos em `assets/content.mjs`, mantendo as mesmas chaves em português e inglês. Rótulos e valores de demonstração devem acompanhar o idioma; moedas permanecem BRL. Nomes de abas e fórmulas originais não são traduzidos. Os módulos web usam dados fictícios e armazenamento de sessão; não possuem integração de gravação nas fontes.

A inspeção das fontes foi direcionada a metadados, cabeçalhos, sentinelas, regras e vínculos. Não equivale à validação integral de cada célula, Apps Script, proteção ou comportamento nativo. As limitações por assunto estão nos respectivos guias. Não declare compatibilidade Excel nem atualização em tempo real sem teste específico.

## English

This document explains the information flow and the boundary of each deliverable. It includes only source titles, worksheet names and rules, with no private links, file identifiers or real operational records.

### Five-area map

| Area | Main sources and worksheets | Confirmed functions | Management view | Required set |
| --- | --- | --- | --- | --- |
| Works & Facilities | GESTÃO CONTRATOS OBRA E FACILITIES OPERACIONAL: VIGÊNCIAS DO CONTRATO, PAGAMENTOS SERVIÇO, PAGAMENTOS MATERIAL, ADITIVOS SERVIÇO, ADITIVOS MATERIAL, CONFERÊNCIA DE ADITIVOS | Financial cycles, categories, balances, amendments and renewals | Contracts, expenses, entries, forecasts, shortfalls, renewals and history | **4 files:** area-specific payment source, operations excluding parking, Base Auxiliar GEIN and area-specific dashboards |
| Properties | GESTÃO DE IMÓVEIS OPERACIONAL: RELAÇÃO IMOVEIS GERAIS, VIGÊNCIAS DO CONTRATO, Aluguéis, Condomínios, IPTU, Taxas | Property register, owned/leased classification, expense categories and due dates | Contracts, expenses, history, overdue entries and data issues | **3 files:** operations, property records and normalization in Base Auxiliar GEIN, property dashboards |
| Fleet | FROTA GEIN — OPERACIONAL: BASE ABASTECIMENTOS E SERVIÇOS, REGISTRO DUPLICIDADE, CONFIGURAÇÕES E CADASTROS; FROTA GEIN — AUXILIARES | Finance, consumption, mileage validation, duplicates and station history | PAINÉIS FROTA GEIN: finance, odometer evolution and mileage report, consumption, duplicates and stations | Operations + supporting calculations + dashboards, with their own references |
| Parking | Selection by OBJETO in general contract operations, with linked transactions | Contracts, locations, terms, entries and recorded space counts | An adapted dedicated web dashboard; the source uses general contract views | **4 files:** area-specific payment source, selected operations, supporting base and dedicated dashboard |
| Price Comparison | Original XLSM comparison model: PESQUISA DE PREÇO | Published references, mean, median, quotations, parts and services | In-sheet summary; web dashboard using a fictional selection | Preserved XLSM and usage/findings guide |

### Data flow

Works & Facilities and Parking have an upstream dependency before operations: **2026 - Gestão de Pagamento de Energia, Água e Imóveis - CREA**, with the **Prestação de serviços**, **Estacionamentos** and **CONEXÃO GEIN** tabs. The connection normalizes monthly blocks and links each source record to its contract key. Each package needs an area-specific copy of this supporting source. Entries without a contract link remain flagged for review. The order is payment source → operations → supporting base → dashboards.

For contracts and properties, operations feed import layers (**RAW**), normalization (**LIVE**), consolidated imports (**IMP**) and supporting calculations (**AUX**). Dashboards read their outputs. Static contingency snapshots also exist. **Base Auxiliar GEIN is shared infrastructure**, not a sixth business project.

For fleet, operations provide transactions and vehicle records; the supporting workbook validates and consolidates; dashboards read the outputs. External references also exist outside connection tabs. Price Comparison keeps inputs and summary on one worksheet, with no external dependency found during inspection.

### Identity and separation

- Contracts use consistent identifiers and terms; company name alone is insufficient.
- Transactions retain category, accounting period and contract linkage. Entries outside a term remain identifiable.
- Properties use register identity and contractual relationships.
- Parking is classified by contract scope and separated from Works & Facilities to prevent double counting.
- Fleet retains its register, aliases and stable-identity decisions. Row position does not replace an occurrence ID.
- Every demonstration identity is fictional and has no connection to private records.

### What each deliverable represents

| Deliverable | Purpose | Boundary |
| --- | --- | --- |
| Project page | Explain the solution and verified features | Not a usable spreadsheet |
| Web demonstration and dashboard | Explore selected rules with fictional data | Not a full native-engine reproduction |
| Preserved native copy | Use the original work’s structure | Available only after sanitization and dependency verification |
| Guide | Explain usage, connections and findings | Not a substitute for operations or dashboards |

### Publication and maintenance rules

Institutional sources are not public demo links. Native copies must remove private data from inputs, notes, properties, formula literals, registers, caches and hidden sheets. Every reference must point only to the public components of its own set, and verification must precede sharing.

Website copy is centralized in `assets/content.mjs`, with matching Portuguese and English keys. Demo labels and values should follow the language; currencies remain BRL. Original sheet names and formulas are not translated. Web modules use fictional data and session storage, with no integration that writes to source workbooks.

Source inspection focused on metadata, headers, sentinel cells, rules and relationships. It is not a complete validation of every cell, Apps Script, protection or native behavior. Area-specific limitations appear in their guides. Do not claim Excel compatibility or real-time updates without specific tests.
