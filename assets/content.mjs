// Site copy is centralized here. Spreadsheet tab names stay in their original language.
export const content = {
  pt: {
    meta: { title: 'Kleyton Gonçalves — Soluções de gestão', description: 'Portfólio de Kleyton Gonçalves Silva: contratos, imóveis, frota, estacionamento e pesquisa de preços. Conheça os projetos e explore demonstrações interativas.' },
    nav: { home: 'Início', projects: 'Projetos', about: 'Sobre mim', contact: 'Contato', menu: 'Abrir menu', close: 'Fechar menu', language: 'Idioma do site', skip: 'Ir para o conteúdo' },
    hero: {
      eyebrow: 'Administração · Processos · Planilhas',
      title: 'Organização que transforma registros em decisões.',
      description: 'Sou Kleyton Gonçalves Silva. Trabalho com contratos, pagamentos, imóveis e frota no CREA-RJ. Desenvolvo planilhas e painéis para tornar as rotinas administrativas mais claras e organizadas.',
      primary: 'Explorar projetos', secondary: 'Conhecer meu percurso',
      caption: 'Cinco assuntos. Uma forma de trabalhar: conectar o registro, a conferência e a visão gerencial.'
    },
    overview: { eyebrow: 'Projetos em prática', title: 'Cada rotina, uma visão própria.', description: 'Explore o funcionamento de cada solução, experimente exemplos e conheça as regras por trás dos indicadores. Todos os dados das demonstrações são fictícios.' },
    profile: {
      eyebrow: 'Por trás dos projetos', title: 'Kleyton Gonçalves Silva',
      description: 'Minha experiência reúne controle de contratos, contas a pagar, documentação e apoio a licitações. Uso Google Planilhas e Excel para conectar informações, acompanhar prazos e facilitar a conferência de processos administrativos.',
      location: 'Niterói, RJ · Brasil', role: 'Auxiliar de Escritório · CREA-RJ',
      experience: [
        { organization: 'CREA-RJ', role: 'Auxiliar de Escritório', period: 'jun/2026 — atual', body: 'Apoio a contratos de obras, facilities e locações; acompanhamento de vigências, aditivos, saldos, notas fiscais, contas a pagar, documentação e registros de frota.' },
        { organization: 'CREA-RJ · CLIC', role: 'Estagiário Administrativo — Licitações e Contratos', period: 'ago/2025 — jun/2026', body: 'Pesquisa de preços, consulta ao mercado e apoio à análise de editais, termos de referência e estimativas com múltiplas fontes.' },
        { organization: 'INSS · Perícia Médica', role: 'Estagiário Administrativo', period: '2023 — 2025', body: 'Abertura e tramitação de processos no SEI, organização documental e encaminhamento às áreas responsáveis.' },
        { organization: 'ECONIT Engenharia Ambiental', role: 'Auxiliar Administrativo', period: 'jan/2020 — jan/2021', body: 'Apoio a folha de ponto, benefícios, documentos de colaboradores e rotinas de recrutamento e seleção.' }
      ],
      education: [
        { title: 'Bacharelado em Administração', institution: 'Centro Universitário UNIFATECIE', status: 'Em andamento · conclusão prevista em jun/2028' },
        { title: 'Tecnólogo em Gestão de Serviços Judiciais', institution: 'Gran Centro Universitário', status: 'Em andamento · conclusão prevista em mai/2028' },
        { title: 'Técnico em Administração', institution: 'SENAI', status: 'Concluído em 2021' }
      ],
      tools: ['Google Planilhas', 'Excel', 'Word', 'SEI', 'PNCP', 'Compras.gov.br', 'Banco de Preços'],
      educationTitle: 'Formação', experienceTitle: 'Experiência', toolsTitle: 'Ferramentas de trabalho'
    },
    contact: { eyebrow: 'Vamos conversar', title: 'Organizar melhor começa com uma boa conversa.', description: 'Para oportunidades profissionais e conversas sobre processos administrativos, contratos e planilhas.', email: 'kleytons67@gmail.com', linkedin: 'https://www.linkedin.com/in/kleyton-gon%C3%A7alves-silva/', emailLabel: 'Enviar e-mail', linkedinLabel: 'Ver LinkedIn' },
    labels: {
      explore: 'Conhecer projeto', back: 'Todos os projetos', overview: 'Apresentação', demo: 'Demonstração', dashboard: 'Painel', guide: 'Ler guia de uso', download: 'Downloads', features: 'O que o projeto organiza', workflow: 'Como funciona', questions: 'Perguntas que o painel ajuda a responder', limitations: 'Escopo e pontos de atenção', sourceSummary: 'Base do projeto', demoNotice: 'Demonstração · dados fictícios', reset: 'Restaurar exemplos', downloadNote: 'Sobre os arquivos', comingSoon: 'Modelo nativo em preparação', footer: 'Portfólio pessoal de Kleyton Gonçalves Silva. Demonstrações com dados fictícios.', languageFiles: 'As planilhas mantêm seu idioma original: português (Brasil).', nativeModel: 'Abrir modelo', makeCopy: 'Fazer uma cópia', package: 'Baixar pacote', viewDemo: 'Ver demonstração', seeDashboard: 'Explorar painel', downloadGuide: 'Baixar guia', technicalGuide: 'Arquitetura dos projetos', experience: 'Experiência', education: 'Formação', tools: 'Ferramentas', related: 'Continue explorando', openExternal: 'Abrir em nova aba', noData: 'Nenhum registro para os filtros selecionados.', archivePending: 'As cópias nativas só serão disponibilizadas após a conferência das dependências e dos dados públicos.', demoStorage: 'As alterações ficam na sessão deste navegador e podem ser restauradas. Nenhum dado é enviado às planilhas de origem.', preview: 'Prévia do projeto', files: 'Arquivos do projeto', sourceLanguage: 'Idioma dos arquivos: português (Brasil)', adaptedDemo: 'A demonstração web apresenta um recorte das regras do projeto.',
      allProjects: 'Ver os cinco projetos', projectCount: 'Cinco projetos', currentRole: 'Atuação atual', resume: 'Currículo', readMore: 'Saiba mais'
    },
    modules: [
      {
        id: 'facilities', title: 'Obras e Facilities', short: 'Contratos, saldos e próximos ciclos.', eyebrow: 'Controle contratual',
        description: 'Uma visão organizada de contratos, vigências, lançamentos e aditivos, com serviços e materiais acompanhados separadamente. A leitura gerencial conecta o saldo disponível à previsão de despesas e às próximas renovações.',
        features: [
          { title: 'Contrato e vigência', body: 'Cada movimentação é vinculada ao contrato e ao ciclo correspondente, preservando o histórico e as pendências de vínculo.' },
          { title: 'Serviço e material', body: 'Empenhos, aditivos e lançamentos por natureza, para entender a composição do saldo sem misturar recursos.' },
          { title: 'Previsão e renovação', body: 'Saldo projetado, insuficiência quando o resultado é negativo e acompanhamento da janela de renovação.' }
        ],
        workflow: ['Conectar a fonte complementar de pagamentos e registrar contratos e vigências na operacional.', 'Relacionar os ciclos e calcular saldos e previsões na base auxiliar.', 'Consultar os painéis e conferir o detalhe de cada contrato.'],
        questions: ['Qual natureza concentra os lançamentos deste contrato?', 'O saldo projetado cobre as competências do ciclo?', 'Quais vigências estão próximas da renovação?'],
        limitations: ['Valor lançado não comprova quitação financeira.', 'O recorte de Estacionamento é apresentado separadamente para evitar dupla contagem.', 'O projeto acompanha a administração dos contratos; execução física e medições de obra não foram identificadas nas fontes.', 'Há trechos de vigências estáticos na base de origem. Atualização automática integral não está confirmada.', 'Na demonstração, média e competências a projetar são entradas explícitas; o motor completo de ciclos permanece nas planilhas.'],
        sourceSummary: 'Fonte complementar de pagamentos, com Prestação de serviços e CONEXÃO GEIN → operacional de contratos → Base Auxiliar GEIN → painéis contratuais, de gastos, previsão, risco, renovação e histórico.',
        downloadNote: 'O conjunto utilizável exige quatro arquivos conectados: fonte complementar temática de pagamentos, operacional, base auxiliar e painéis. Um painel isolado não representa o sistema completo. Arquivos em português; as exportações Excel inspecionadas apresentaram incompatibilidades de fórmulas.', guide: 'docs/facilities.md'
      },
      {
        id: 'imoveis', title: 'Imóveis', short: 'Cada imóvel, suas despesas e seus prazos.', eyebrow: 'Administração de imóveis',
        description: 'Cadastro, contratos e despesas reunidos por imóvel. Aluguéis, condomínios, IPTU e taxas permanecem identificáveis, com vencimentos, lançamentos e situações que precisam de conferência.',
        features: [
          { title: 'Identidade do imóvel', body: 'Cadastro e vínculo próprio ou locado orientam a consulta, sem depender apenas do nome do fornecedor.' },
          { title: 'Composição das despesas', body: 'Aluguéis, condomínios, IPTU e taxas separados, com seus próprios registros e datas de vencimento.' },
          { title: 'Pendências em contexto', body: 'Consulta a despesas vencidas sem lançamento e a registros com informações insuficientes para conferência.' }
        ],
        workflow: ['Manter o cadastro, as vigências e cada natureza de despesa.', 'Relacionar os registros pelo imóvel e normalizar as competências.', 'Consultar composição, histórico, vencimentos e anomalias.'],
        questions: ['Quais despesas estão vinculadas ao imóvel selecionado?', 'Há vencimentos passados sem valor positivo lançado?', 'Quais registros precisam de data ou conferência documental?'],
        limitations: ['A vigência do contrato e o vencimento da despesa são datas diferentes.', 'Atraso de lançamento não significa inadimplência comprovada.', 'Protocolo ou lançamento sem vencimento gera uma pendência de dados, não um vencimento presumido.', 'Dados bancários, documentos e pessoas das fontes não fazem parte da demonstração.'],
        sourceSummary: 'Operacional de imóveis → cadastro e movimentações na Base Auxiliar GEIN → painéis de imóveis, despesas, histórico, atrasos e anomalias.',
        downloadNote: 'A utilização completa exige cadastro, operacional das quatro despesas, base auxiliar e painéis. As planilhas permanecem em português e precisam de conexões próprias entre as cópias públicas.', guide: 'docs/imoveis.md'
      },
      {
        id: 'frota', title: 'Frota', short: 'Despesas, quilometragem e conferência.', eyebrow: 'Visão operacional da frota',
        description: 'Abastecimentos e serviços conectados ao cadastro da frota, às verificações de consumo e aos relatórios de quilometragem. A solução diferencia os veículos e oferece caminhos para investigar ocorrências.',
        features: [
          { title: 'Despesas por contexto', body: 'Resumo por período e vínculo do veículo, mantendo abastecimentos e outros serviços identificáveis.' },
          { title: 'Quilometragem e consumo', body: 'Histórico de hodômetros e regras de validação sustentam as leituras gerenciais, separados dos alertas de consumo recebidos na base.' },
          { title: 'Ocorrências para análise', body: 'Múltiplos abastecimentos, possíveis duplicidades financeiras e histórico de postos ajudam a direcionar a conferência.' }
        ],
        workflow: ['Registrar abastecimentos, serviços, cadastros e decisões de conferência.', 'Validar leituras e consolidar despesas e quilometragem na base auxiliar.', 'Filtrar os painéis por período, veículo e classificação.'],
        questions: ['Como as despesas se distribuem entre veículos e serviços?', 'Quais registros apresentam alertas de consumo ou repetição?', 'Que quilometragem está coberta pelas leituras disponíveis?'],
        limitations: ['Alertas indicam situações para conferência; não comprovam erro ou irregularidade.', 'Lavagem e outros serviços não entram como consumo de combustível.', 'A demonstração usa uma conferência didática de hodômetros. Não reproduz a mediana histórica, a reconexão de leituras nem o rateio mensal do motor nativo.', 'O original utiliza regras distintas de quilometragem por categoria e limites próprios de linhas; não há rastreamento em tempo real.'],
        sourceSummary: 'Frota GEIN — Operacional → Frota GEIN — Auxiliares → Painéis Frota GEIN, incluindo financeiro, KM, consumo, duplicidades e monitoramento de postos.',
        downloadNote: 'O sistema depende de três arquivos conectados. Cadastros, decisões e referências externas devem acompanhar as cópias, mantendo as regras nativas do Google Planilhas e o idioma português.', guide: 'docs/frota.md'
      },
      {
        id: 'estacionamento', title: 'Estacionamento', short: 'Contratos e locais em uma área própria.', eyebrow: 'Recorte contratual temático',
        description: 'Uma apresentação dedicada aos contratos de estacionamento, identificados pelo objeto e pelo vínculo contratual. Locais, vigências, valores e registros mensais ficam reunidos para consulta.',
        features: [
          { title: 'Contrato e local', body: 'O objeto orienta a classificação, enquanto o identificador do contrato mantém contratos da mesma empresa separados.' },
          { title: 'Vagas quando informadas', body: 'Quantidades são exibidas somente quando registradas, sem preencher ausências com números presumidos.' },
          { title: 'Valores com significado', body: 'Valor contratado, previsão mensal e lançamento permanecem distintos; o valor global não vira mensalidade automaticamente.' }
        ],
        workflow: ['Identificar os contratos pelo objeto e conectar o recorte de Estacionamentos da fonte de pagamentos.', 'Preservar vigências, aditivos e movimentações vinculados ao recorte.', 'Consultar o painel temático por local, contrato e período.'],
        questions: ['Qual contrato atende cada local do exemplo?', 'Quais vagas estão explicitamente informadas?', 'O registro do mês é uma previsão ou um valor lançado?'],
        limitations: ['O painel web é uma adaptação temática; não havia painel nativo exclusivo de estacionamento nas fontes inspecionadas.', 'Quantidade de vagas ausente permanece não informada.', 'Lançamento positivo não equivale a pagamento confirmado.', 'Os contratos deste recorte não devem entrar novamente na soma de Obras e Facilities.'],
        sourceSummary: 'Fonte complementar de pagamentos, abas Estacionamentos e CONEXÃO GEIN → contratos selecionados pelo objeto na operacional → Base Auxiliar GEIN → adaptação temática das visões contratuais.',
        downloadNote: 'O pacote exige quatro arquivos: fonte complementar temática de pagamentos, operacional recortada, base auxiliar e painel. Deve preservar ciclos e movimentos do recorte sem incluir outros contratos. Registros sem vínculo permanecem pendências e as adaptações de separação devem ser documentadas.', guide: 'docs/estacionamento.md'
      },
      {
        id: 'precos', title: 'Mapa de Preço', short: 'Referências e propostas lado a lado.', eyebrow: 'Pesquisa e comparação de preços',
        description: 'Um modelo comparativo que reúne referências de mídia, propostas de fornecedores e composição entre peças e serviços. A demonstração mostra como interpretar os valores e reconhecer propostas incompletas.',
        features: [
          { title: 'Referências da pesquisa', body: 'O original prevê três referências de mídia e calcula média e mediana por item.' },
          { title: 'Propostas de fornecedores', body: 'Três espaços de propostas e um resumo de peças, serviços e total de manutenção.' },
          { title: 'Comparação legível', body: 'A demonstração distingue ausência de cotação e valor zero, sinalizando propostas incompletas e diferenças de base.' }
        ],
        workflow: ['Descrever itens, quantidades, referências e propostas comparáveis.', 'Conferir a base de cálculo e os valores de peças e serviços.', 'Ler as medidas de referência e a composição das propostas.'],
        questions: ['Quais valores formam a referência de cada item?', 'A proposta contém todos os itens necessários?', 'Quanto corresponde a peças e quanto a serviços?'],
        limitations: ['As fórmulas originais alternam referências unitárias e totais em algumas linhas; quantidades diferentes de um exigem conferência.', 'A demonstração usa quantidade igual a um em cada item para manter comparáveis as bases unitária e total.', 'Campos vazios não são propostas de preço zero.', 'O original não define ranking, vencedor ou exclusão estatística de cotações.', 'O arquivo mantém o formato .xlsm. Não foi encontrado projeto VBA na cópia analisada; isso não substitui teste de recálculo no Excel.'],
        sourceSummary: 'Modelo original XLSM, aba PESQUISA DE PREÇO, com entradas e resumo comparativo na mesma planilha.',
        downloadNote: 'A cópia pública preserva o formato XLSM e as fórmulas originais, com identificadores substituídos por conteúdo demonstrativo. O guia registra os pontos de atenção. Arquivo em português; consulte o status de validação junto ao download.', guide: 'docs/precos.md'
      }
    ]
  },
  en: {
    meta: { title: 'Kleyton Gonçalves — Administrative solutions', description: 'Kleyton Gonçalves Silva’s portfolio: contracts, properties, fleet, parking and price research. Explore the projects and interactive demonstrations.' },
    nav: { home: 'Home', projects: 'Projects', about: 'About me', contact: 'Contact', menu: 'Open menu', close: 'Close menu', language: 'Website language', skip: 'Skip to content' },
    hero: {
      eyebrow: 'Administration · Processes · Spreadsheets', title: 'Organized records. Better-informed decisions.',
      description: "I'm Kleyton Gonçalves Silva. I work with contract, payment, property and fleet administration at CREA-RJ. I build spreadsheets and dashboards to make administrative routines clearer and more organized.",
      primary: 'Explore projects', secondary: 'About my experience', caption: 'Five areas. One approach: connect the records, the checks and the management view.'
    },
    overview: { eyebrow: 'Projects in practice', title: 'A distinct view for each workflow.', description: 'Discover how each solution works, try the examples and understand the rules behind its indicators. All demonstration data is fictional.' },
    profile: {
      eyebrow: 'Behind the projects', title: 'Kleyton Gonçalves Silva',
      description: 'My experience covers contract administration, accounts payable, documentation and procurement support. I use Google Sheets and Excel to connect information, monitor deadlines and make administrative records easier to review.',
      location: 'Niterói, Rio de Janeiro · Brazil', role: 'Office Assistant · CREA-RJ',
      experience: [
        { organization: 'CREA-RJ', role: 'Office Assistant', period: 'Jun 2026 — present', body: 'Support for works, facilities and lease contracts; monitoring terms, amendments, balances, invoices, accounts payable, documentation and fleet records.' },
        { organization: 'CREA-RJ · CLIC', role: 'Administrative Intern — Procurement and Contracts', period: 'Aug 2025 — Jun 2026', body: 'Price research, market consultation and support for tender documents, terms of reference and estimates based on multiple sources.' },
        { organization: 'INSS · Medical Assessment', role: 'Administrative Intern', period: '2023 — 2025', body: 'Opening and routing administrative cases in SEI, organizing documentation and forwarding records to the responsible departments.' },
        { organization: 'ECONIT Engenharia Ambiental', role: 'Administrative Assistant', period: 'Jan 2020 — Jan 2021', body: 'Support for timesheets, benefits, employee records and recruitment routines.' }
      ],
      education: [
        { title: "Bachelor's degree in Business Administration", institution: 'Centro Universitário UNIFATECIE', status: 'In progress · expected completion Jun 2028' },
        { title: 'Technology degree in Judicial Services Management', institution: 'Gran Centro Universitário', status: 'In progress · expected completion May 2028' },
        { title: 'Technical qualification in Administration', institution: 'SENAI', status: 'Completed in 2021' }
      ],
      tools: ['Google Sheets', 'Excel', 'Word', 'SEI', 'PNCP', 'Compras.gov.br', 'Banco de Preços'], educationTitle: 'Education', experienceTitle: 'Experience', toolsTitle: 'Working tools'
    },
    contact: { eyebrow: 'Get in touch', title: 'Better organization starts with a conversation.', description: 'For professional opportunities and conversations about administrative processes, contracts and spreadsheets.', email: 'kleytons67@gmail.com', linkedin: 'https://www.linkedin.com/in/kleyton-gon%C3%A7alves-silva/', emailLabel: 'Send an email', linkedinLabel: 'View LinkedIn' },
    labels: {
      explore: 'Explore project', back: 'All projects', overview: 'Overview', demo: 'Demonstration', dashboard: 'Dashboard', guide: 'Read the user guide', download: 'Downloads', features: 'What the project organizes', workflow: 'How it works', questions: 'Questions the dashboard helps answer', limitations: 'Scope and considerations', sourceSummary: 'Project foundation', demoNotice: 'Demonstration · fictional data', reset: 'Reset examples', downloadNote: 'About the files', comingSoon: 'Native model in preparation', footer: 'Kleyton Gonçalves Silva’s personal portfolio. Demonstrations use fictional data.', languageFiles: 'Spreadsheets retain their original language: Brazilian Portuguese.', nativeModel: 'Open model', makeCopy: 'Make a copy', package: 'Download package', viewDemo: 'View demonstration', seeDashboard: 'Explore dashboard', downloadGuide: 'Download guide', technicalGuide: 'Project architecture', experience: 'Experience', education: 'Education', tools: 'Tools', related: 'Keep exploring', openExternal: 'Open in a new tab', noData: 'No records match the selected filters.', archivePending: 'Native copies will become available after their dependencies and public data have been checked.', demoStorage: 'Demo edits stay in this browser session and can be reset. No data is sent to the source spreadsheets.', preview: 'Project preview', files: 'Project files', sourceLanguage: 'File language: Brazilian Portuguese', adaptedDemo: 'The web demonstration presents a selection of the project’s rules.', allProjects: 'View all five projects', projectCount: 'Five projects', currentRole: 'Current role', resume: 'Résumé', readMore: 'Learn more'
    },
    modules: [
      {
        id: 'facilities', title: 'Works & Facilities', short: 'Contracts, balances and upcoming terms.', eyebrow: 'Contract administration',
        description: 'An organized view of contracts, terms, entries and amendments, with services and materials tracked separately. Management views connect the available balance with forecast expenses and upcoming renewals.',
        features: [
          { title: 'Contracts and terms', body: 'Each transaction is linked to its contract and financial cycle, preserving the history and any unresolved links.' },
          { title: 'Services and materials', body: 'Budget commitments, amendments and entries by category make each balance understandable without mixing funds.' },
          { title: 'Forecasts and renewals', body: 'Projected balances, shortfalls when the result is negative, and a view of the renewal window.' }
        ],
        workflow: ['Connect the supporting payment source and record contracts and terms in the operational workbook.', 'Link financial cycles and calculate balances and forecasts in the supporting base.', 'Use the dashboards and inspect each contract’s details.'],
        questions: ['Which category accounts for this contract’s entries?', 'Does the projected balance cover the cycle?', 'Which contract terms are approaching renewal?'],
        limitations: ['A recorded amount does not prove that a payment has settled.', 'Parking contracts are shown separately to prevent double counting.', 'The project covers contract administration; physical construction progress and engineering measurements were not identified in the sources.', 'Some source contract-term data is static. Fully automatic updates have not been confirmed.', 'In the demo, the average and periods to forecast are explicit inputs. The full financial-cycle engine remains in the spreadsheets.'],
        sourceSummary: 'Supporting payment source, with Prestação de serviços and CONEXÃO GEIN → contract operations → Base Auxiliar GEIN → contract, expense, forecast, risk, renewal and history dashboards.',
        downloadNote: 'A usable set needs four connected files: the area-specific payment source, operations, supporting base and dashboards. A dashboard alone is not the complete system. Files are in Portuguese; the inspected Excel exports contained incompatible formulas.', guide: 'docs/facilities.md'
      },
      {
        id: 'imoveis', title: 'Properties', short: 'Each property, its expenses and deadlines.', eyebrow: 'Property administration',
        description: 'Property records, contracts and expenses linked in one view. Rent, condominium charges, property tax and fees remain identifiable, with due dates, entries and issues requiring review.',
        features: [
          { title: 'Property identity', body: 'The property record and owned or leased classification guide the view, without relying only on the supplier’s name.' },
          { title: 'Expense composition', body: 'Rent, condominium charges, property tax and fees are kept separate, each with its own records and due dates.' },
          { title: 'Issues in context', body: 'Review past-due expenses without an entry and records with insufficient information for verification.' }
        ],
        workflow: ['Maintain property records, contract terms and each expense category.', 'Link records to their property and normalize the accounting periods.', 'Review composition, history, due dates and data issues.'],
        questions: ['Which expenses belong to the selected property?', 'Have any due dates passed without a positive amount recorded?', 'Which records need a date or document review?'],
        limitations: ['The contract term and an expense’s due date are different dates.', 'An overdue entry does not establish a payment default.', 'A document reference or entry without a due date creates a data issue, not an assumed deadline.', 'Source banking information, documents and personal data are excluded from the demonstration.'],
        sourceSummary: 'Property operations → property records and transactions in Base Auxiliar GEIN → property, expense, history, overdue-entry and data-issue dashboards.',
        downloadNote: 'The complete set requires property records, the four expense workflows, a supporting base and dashboards. Spreadsheets remain in Portuguese and require connections between their own public copies.', guide: 'docs/imoveis.md'
      },
      {
        id: 'frota', title: 'Fleet', short: 'Expenses, mileage and record checks.', eyebrow: 'Fleet operations',
        description: 'Fuel and service records connected to the vehicle register, consumption checks and mileage reports. The solution distinguishes vehicle categories and provides paths for investigating flagged records.',
        features: [
          { title: 'Expenses in context', body: 'Views by period and vehicle classification keep fuel and other services identifiable.' },
          { title: 'Mileage and consumption', body: 'Odometer history and validation rules support management views, separately from consumption alerts based on imported input values.' },
          { title: 'Records for review', body: 'Multiple refuelling events, possible financial duplicates and fuel-station history help direct further checks.' }
        ],
        workflow: ['Record fuel, services, vehicle details and review decisions.', 'Validate readings and consolidate expenses and mileage in the supporting base.', 'Filter dashboards by period, vehicle and classification.'],
        questions: ['How are expenses distributed across vehicles and services?', 'Which records carry consumption or repetition alerts?', 'Which mileage is covered by the available readings?'],
        limitations: ['Alerts identify records for review; they do not prove an error or irregularity.', 'Washing and other services are excluded from fuel-consumption calculations.', 'The demonstration uses an educational odometer check. It does not reproduce the native engine’s historical median, reading reconnection or monthly allocation.', 'The original uses category-specific mileage rules and its own row limits. It does not provide real-time tracking.'],
        sourceSummary: 'Frota GEIN — Operacional → Frota GEIN — Auxiliares → Painéis Frota GEIN, covering finance, mileage, consumption, duplicates and station monitoring.',
        downloadNote: 'The system depends on three connected files. Vehicle records, decisions and external references must accompany the copies, preserving native Google Sheets rules and the Portuguese language.', guide: 'docs/frota.md'
      },
      {
        id: 'estacionamento', title: 'Parking', short: 'Contracts and locations in a dedicated view.', eyebrow: 'A focused contract view',
        description: 'A dedicated presentation of parking contracts, identified by their scope and contract relationships. Locations, terms, amounts and monthly records come together for review.',
        features: [
          { title: 'Contracts and locations', body: 'The contract scope determines the classification, while contract identifiers keep separate agreements with the same company distinct.' },
          { title: 'Spaces when recorded', body: 'Space counts are displayed only when recorded, without filling gaps with assumed quantities.' },
          { title: 'Meaningful amounts', body: 'Contract values, monthly forecasts and recorded amounts remain distinct. Global values are not automatically converted to monthly fees.' }
        ],
        workflow: ['Identify contracts by scope and connect the parking selection from the supporting payment source.', 'Preserve each contract’s terms, amendments and linked transactions.', 'Explore the dedicated dashboard by location, contract and period.'],
        questions: ['Which contract serves each example location?', 'Where are parking-space counts explicitly recorded?', 'Is the monthly figure a forecast or a recorded amount?'],
        limitations: ['The web dashboard is a dedicated adaptation; the inspected sources did not contain a separate native parking dashboard.', 'Missing space counts remain unspecified.', 'A positive entry does not confirm settled payment.', 'These contracts must not be included again in Works & Facilities totals.'],
        sourceSummary: 'Supporting payment source, Estacionamentos and CONEXÃO GEIN tabs → contracts selected by scope in operations → Base Auxiliar GEIN → a dedicated adaptation of contract views.',
        downloadNote: 'The package needs four files: the area-specific payment source, selected operations, supporting base and dashboard. It must retain the selection’s financial cycles and transactions while excluding unrelated contracts. Unlinked records remain pending review, and separation changes must be documented.', guide: 'docs/estacionamento.md'
      },
      {
        id: 'precos', title: 'Price Comparison', short: 'References and quotations, side by side.', eyebrow: 'Price research and comparison',
        description: 'A comparison workbook combining published price references, supplier quotations, parts and services. The demonstration explains how to interpret amounts and identify incomplete proposals.',
        features: [
          { title: 'Research references', body: 'The original has room for three published references and calculates a mean and median for each item.' },
          { title: 'Supplier quotations', body: 'Three quotation columns and a summary of parts, services and total maintenance cost.' },
          { title: 'Readable comparisons', body: 'The demo distinguishes missing quotations from zero values and flags incomplete proposals and differences in comparison basis.' }
        ],
        workflow: ['Describe items, quantities, references and comparable quotations.', 'Check the calculation basis and the parts and service amounts.', 'Review reference statistics and quotation composition.'],
        questions: ['Which values form each item’s reference?', 'Does the quotation include every required item?', 'How much relates to parts and how much to services?'],
        limitations: ['Some original formulas alternate between unit and total references. Quantities other than one require review.', 'The demo uses a quantity of one for every item to keep unit and total comparisons on the same basis.', 'Blank fields are not zero-price quotations.', 'The original does not define a ranking, winning supplier or statistical quotation-exclusion rule.', 'The file retains its .xlsm format. No VBA project was found in the inspected copy; this does not replace a recalculation test in Excel.'],
        sourceSummary: 'Original XLSM workbook, PESQUISA DE PREÇO tab, with inputs and comparison summary in the same worksheet.',
        downloadNote: 'The public copy retains the XLSM format and original formulas, with identifiers replaced by demonstration content. Its guide documents the findings. File language: Portuguese. Check the validation status beside the download.', guide: 'docs/precos.md'
      }
    ]
  }
};
