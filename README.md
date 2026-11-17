# Kleyton Gonçalves Silva · portfólio e currículo

Site estático (HTML, CSS e JavaScript puros, sem build), compatível com GitHub Pages: <https://kleytongoncalves-adm.github.io/Portef-lio-/>.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Portfólio: painel de inteligência no topo, frentes de atuação, case principal (arquitetura em 3 camadas), escala, cinco análises interativas, outros sistemas, arquitetura de dados, trajetória, formação e contato |
| `curriculo.html` | Currículo em formato A4, pronto para "Salvar em PDF / imprimir" |

## Estrutura

```
assets/
  site.css   sistema de design "Dark Data Intelligence" (tokens, componentes, gráficos, responsivo, impressão)
  site.js    interações e demonstrações (gráficos SVG próprios, abas, filtros, simuladores)
  data.js    base FICTÍCIA de demonstração (gerador determinístico)
  og.png     imagem de compartilhamento
  mark.svg   ícone
```

## Confidencialidade

O portfólio mostra o que eu sei fazer, não detalhes de onde ou como executo cada atividade.
Os projetos são apresentados como iniciativas próprias, com estrutura genérica e **dados fictícios** (`assets/data.js`).
Não há nomes de sistemas institucionais, valores, contagens, contratos, fornecedores ou processos reais.

## Decisões de design

- **Tema escuro por padrão**, com alternância para o claro (escolha salva no navegador).
- **Tipografia:** Space Grotesk (títulos), Inter (texto), IBM Plex Mono (números e metadados).
- **Gráficos:** SVG desenhados na largura real do contêiner, com dica ao passar o mouse; cores categóricas validadas para daltonismo e legenda sempre presente.
- **Movimento com função:** entrada ao rolar, contagem progressiva, fluxo de dados. Tudo respeita `prefers-reduced-motion`.
- **Acessibilidade:** link "Ir para o conteúdo", foco visível, abas com setas do teclado, regiões `aria-live` nos resultados.

## Rodar localmente

```sh
python3 -m http.server 8000
```
