# Kleyton Gonçalves — portfólio de soluções de gestão

Site estático bilíngue (português/inglês), desenvolvido para este repositório. Reúne cinco áreas de atuação e demonstrações interativas com dados inteiramente fictícios.

| Projeto | Página | Demonstração |
| --- | --- | --- |
| Obras e Facilities | `obras-facilities.html` | Serviços/materiais, saldo e projeção demonstrativa |
| Imóveis | `imoveis.html` | Composição, vencimento e pendências de lançamento |
| Frota | `frota.html` | Financeiro, consumo e conferências demonstrativas |
| Estacionamento | `estacionamento.html` | Contratos, vagas e natureza de valores |
| Mapa de Preço | `mapa-de-preco.html` | Cotações, completude e composição de propostas |

## Rodar localmente

Não é necessário compilar nem instalar bibliotecas para usar o site. Sirva os arquivos por HTTP:

```sh
python3 -m http.server 4173
```

Abra `http://localhost:4173`. Não abra o HTML diretamente pelo explorador de arquivos: módulos JavaScript e leitura de guias precisam de um servidor HTTP.

Testes das regras e da integridade dos arquivos (Node.js 20+):

```sh
npm test
```

## Publicar no GitHub Pages

O código completo está na raiz e usa caminhos relativos, incluindo o subdiretório deste repositório. Não há configuração de domínio antigo.

1. No repositório, entre em **Settings → Pages**.
2. Em **Build and deployment → Source**, selecione **Deploy from a branch**.
3. Selecione **main** e **/(root)** e clique **Save**.
4. Aguarde o processo de publicação e use o endereço exibido pelo próprio GitHub em Pages.
5. Confira as cinco páginas, o seletor de idiomas, os filtros e os downloads no endereço publicado.

A presença do código no repositório não comprova que o GitHub Pages foi ativado. Consulte o status da publicação antes de divulgar um endereço.

Referência oficial: [Configuração da origem de publicação](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Materiais entregues e limites

- **Site:** cinco páginas temáticas, apresentação profissional baseada no currículo, interface PT/EN, navegação contextual por mouse/teclado/toque e CSS responsivo com respeito a movimento reduzido.
- **Demonstrações:** filtros, tabelas, indicadores e gráficos calculados sobre exemplos; edição, restauração e armazenamento na sessão. Nenhuma escrita nas fontes.
- **Mapa de Preço:** modelo XLSM original sanitizado, ZIP, guias PT/EN, prévia e relatório. As fórmulas originais foram preservadas, inclusive inconsistências documentadas; requer revisão funcional antes de uso operacional.
- **Demais planilhas nativas:** distribuição pública pendente. Fontes dependem de outros workbooks, dados internos e recursos cuja sanitização/execução completa ainda não foi certificada. Não são oferecidas exportações Excel com fórmulas quebradas como sistemas utilizáveis.
- **Guias:** `guia.html` exibe os arquivos de `docs/` no idioma selecionado. O download Markdown inclui as duas versões.

Os demonstradores são adaptações explicativas, não réplicas integrais de todos os motores das planilhas. Limitações específicas ficam junto de cada painel e nos guias. Nenhum dado de instituição, contratado, veículo ou pessoa foi copiado para os exemplos.

[Arquitetura](docs/architecture.md) · [Dependências das planilhas](docs/DEPENDENCIAS-PLANILHAS.md) · [Validação](docs/VALIDACAO.md)

## Atualizar conteúdo

- Textos e perfil: `assets/content.mjs`, nas chaves `pt` e `en`.
- Interface compartilhada: `assets/ui.mjs`.
- Aparência: `assets/site.css`; logotipo pessoal: `assets/mark.svg`.
- Páginas/navegação: `assets/app.mjs` e arquivos HTML da raiz.
- Exemplos e cálculos: `modules/demos.mjs`. Manter os dados fictícios e atualizar testes quando mudar regras.
- Guias: `docs/*.md`, mantendo os marcadores `## Português` e `## English`.
- Planilhas: adicionar somente cópias derivadas, sanitizadas e verificadas em `downloads/`. Atualizar o status de download apenas depois de validar o pacote inteiro, seus vínculos e fórmulas.

A troca de idioma não converte reais para outra moeda. Planilhas e nomes de abas conservam o português original. Links das fontes privadas nunca devem ser colocados no site nem nos downloads.

## English

A bilingual, dependency-free static portfolio with five distinct interactive demonstrations. Serve this directory over HTTP and run `npm test` to check calculation rules and file integrity. Enable GitHub Pages from `main` at the repository root, then use the deployment URL provided by GitHub.

The price-comparison XLSM is a sanitized derivative of the original, with its formulas and documented issues preserved. Other native workbook packages are not yet publicly distributable: their dependencies, private data and runtime behavior require further validation. Web demonstrations are educational adaptations with fictional data, never a replacement for the original workbooks.
