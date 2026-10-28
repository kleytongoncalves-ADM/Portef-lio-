# Kleyton Gonçalves — portfólio e currículo

Site estático (HTML, CSS e JavaScript puros, sem build) publicado no Netlify em <https://kleyton-adm.netlify.app>.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Portfólio: painel de contratos com filtros, competências, projetos, laboratório (simuladores de saldo e de renovação), princípios, trajetória, formação e contato |
| `curriculo.html` | Currículo em formato A4, pronto para "Salvar em PDF / imprimir" |

## Estrutura

```
assets/
  v4.css   sistema de design único (tokens, componentes, movimento, responsivo, impressão)
  v4.js    interações (tema, menu, filtros, simuladores, avisos); o conteúdo funciona sem JS
  og.png   imagem de compartilhamento
  mark.svg ícone
```

## Decisões de design

- **Um só sistema:** as duas páginas usam os mesmos tokens de cor, elevação, forma e movimento (`:root` em `v4.css`).
- **Tema claro/escuro:** segue o sistema e pode ser alternado; a escolha fica salva no navegador.
- **Movimento com função:** entrada suave só do que está abaixo da dobra, transição entre páginas, indicador do menu, números dos simuladores. Respeita `prefers-reduced-motion`.
- **Acessibilidade:** link "Ir para o conteúdo", foco visível, rótulos nos controles, regiões `aria-live` nos resultados e navegação completa por teclado.
- **Dados:** todas as demonstrações usam dados fictícios; nada é enviado a servidores.

## Rodar localmente

Basta servir a pasta por HTTP, por exemplo:

```sh
npx serve .
```

## Publicação

O Netlify publica a branch `main` deste repositório automaticamente.
