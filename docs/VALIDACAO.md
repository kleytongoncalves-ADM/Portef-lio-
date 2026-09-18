# Validação e pendências / Validation and remaining work

## Português

### Executado

- Leitura de metadados e fórmulas das sete fontes indicadas; dependência complementar de pagamentos encontrada e inspecionada.
- Currículo analisado para confirmar nome, cargos, datas, formação e contato profissional.
- XLSM sanitizado com estrutura preservada: 40 fórmulas, 167 mesclagens, estilos e regras condicionais; relatório e hashes em `downloads/precos/`.
- Testes Node: risco zero/positivo/negativo, falta de insumos, preço ausente versus zero, proposta incompleta, lavagem, duplicidade financeira, delta didático de hodômetro, vencimentos de imóveis, estacionamento e filtros vazios.
- Verificações estáticas: rotas, módulos importados, downloads locais, guias, paridade das traduções e busca de dados/URLs privados no pacote público.
- Prévia real do XLSM renderizada e inspecionada; os erros do modelo em branco e diferenças do motor de renderização estão documentados no guia do arquivo.

### Não afirmar como validado

- Não foi concluída inspeção visual/interativa do site em navegador de computador ou celular. O navegador disponível não abre servidor local; a verificação final depende da publicação acessível.
- Não houve execução do XLSM no Microsoft Excel. As inconsistências do original permanecem documentadas; exportação ou preview não provam recálculo nativo.
- Não foram concluídos pacotes nativos públicos de Obras, Imóveis, Frota e Estacionamento. Nenhum link público das fontes foi criado.
- Não foi auditada a totalidade de Apps Script, gatilhos e todas as células/recursos nativos das fontes. As leituras de fórmulas são estruturais e amostrais; a auditoria do pacote XLSM anexado foi integral para os componentes listados no relatório próprio.
- O repositório conter código não significa que GitHub Pages esteja ativo. Verificar o endereço exibido em Settings → Pages após a ativação.

### Conferência após publicar

1. Abrir início e cinco módulos no computador e celular; verificar legibilidade e ausência de overflow horizontal da página (tabelas possuem rolagem própria).
2. Usar Tab/Enter/Escape nos menus e conferir foco visível.
3. Trocar para English no módulo, navegar a outro e confirmar persistência do idioma.
4. Filtrar, abrir detalhe, editar um exemplo, conferir recalculação e restaurar.
5. Usar filtros incompatíveis e conferir mensagem de ausência; valores faltantes nunca devem aparecer como pagamento zero.
6. Baixar XLSM/ZIP e guias; comparar hash do XLSM com o manifesto.

## English

Calculation and static-integrity tests have been run. The attached workbook was sanitized and its original formulas, merged cells, styles and conditional rules were preserved; verification details are included with the download.

Visual/interactive browser validation on desktop and mobile is not complete because the available browser cannot open the local server. Native Microsoft Excel recalculation has not been tested. The four other native workbook packages remain unavailable for public distribution, pending dependency, sanitization and native-runtime checks. Source workbooks and their permissions have not been modified.

After deployment, check all routes, responsive layout, keyboard menus, persistent language selection, filters, editing/reset and downloads. Code in this repository does not prove that GitHub Pages is enabled.
