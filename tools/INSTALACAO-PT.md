# Instalar o pacote no Google Planilhas

Os arquivos XLSX deste pacote são transportes dos modelos originais. Para usar as fórmulas e as conexões entre arquivos no Google Planilhas, importe todos os componentes e execute a restauração abaixo. Abrir o XLSX no Excel não reproduz funções exclusivas do Google, como `IMPORTRANGE`.

O instalador usa o `manifesto-*.json` incluído no mesmo pacote para restaurar nomes completos das abas, dimensões, fuso, configuração regional, fórmulas e validações registradas no manifesto. Mantém a estrutura e o visual transportados nos XLSX. Não cria um modelo diferente.

## 1. Criar suas cópias

1. Extraia o ZIP no computador.
2. Envie **todos os XLSX** e o arquivo `manifesto-*.json` do pacote para uma pasta no seu Google Drive.
3. Abra cada XLSX com Google Planilhas. Use **Arquivo → Salvar como Planilhas Google** para criar o arquivo nativo. Abrir em modo de edição do Excel não é suficiente.
4. Mantenha o nome do arquivo igual ao nome do XLSX, retirando apenas `.xlsx`. Não altere os nomes das abas nem preencha dados antes de concluir a instalação.
5. Copie o ID de cada nova planilha: no endereço `https://docs.google.com/spreadsheets/d/ID/edit`, copie apenas `ID`.
6. Copie também o ID do JSON: no link de compartilhamento `https://drive.google.com/file/d/ID/view`, copie apenas `ID`. O JSON pode continuar privado.

Use exclusivamente as novas cópias dos arquivos do pacote. O instalador recusa nomes diferentes e quantidades de abas incompatíveis. Se houver dados em células que precisariam sair da grade, ele interrompe antes de escrever.

## 2. Preparar o projeto Apps Script

1. Abra [Google Apps Script](https://script.google.com/) e crie **Novo projeto**.
2. Abra `ConfigurarModelos.gs` deste pacote num editor de texto. Copie seu conteúdo inteiro para o arquivo `Código.gs`/`Code.gs` do projeto, substituindo o conteúdo inicial.
3. Nas **Configurações do projeto**, marque a opção para mostrar o arquivo de manifesto `appsscript.json` no editor.
4. Volte ao editor, abra `appsscript.json` e substitua seu conteúdo pelo arquivo de mesmo nome incluído no pacote. Esse arquivo ativa o serviço Google Sheets API v4 e declara as permissões necessárias.
5. No início do código, preencha `MANIFESTO_ID` com o ID do JSON do pacote.
6. No seletor de funções, execute `listarComponentes`. Autorize o projeto na sua conta Google. O registro da execução mostra os arquivos e as chaves que devem constar em `IDS`.
7. Preencha `IDS` com essas chaves e os IDs das cópias correspondentes. Mantenha `CONFIRMACAO: ''` nesta etapa.

Exemplo de preenchimento para um pacote de Frota:

```javascript
var CONFIG_MODELOS = {
  MANIFESTO_ID: 'ID_DO_JSON_NO_SEU_DRIVE',
  IDS: {
    operacional: 'ID_DA_COPIA_OPERACIONAL',
    auxiliares: 'ID_DA_COPIA_AUXILIARES',
    paineis: 'ID_DA_COPIA_PAINEIS'
  },
  CONFIRMACAO: ''
};
```

Outros pacotes podem usar chaves diferentes. Copie as chaves exibidas por `listarComponentes` e não os valores ilustrativos acima.

As permissões são de leitura do Drive para abrir o manifesto e conferir os arquivos, e de edição de planilhas para restaurar as cópias informadas. O código não compartilha arquivos, não envia dados a serviços externos e não solicita acesso a e-mail. Se o projeto estiver ligado a um projeto próprio do Google Cloud, ative também a Google Sheets API nesse projeto.

## 3. Conferir e executar

1. Execute `prepararInstalacao`. Essa função é somente leitura: verifica todos os componentes e mostra os links das cópias.
2. Confira os links no registro da execução. Copie o código `INSTALAR-...` exibido para `CONFIG_MODELOS.CONFIRMACAO`.
3. Execute `executarInstalacao`.
4. Se aparecer `complete: false`, execute a **mesma função novamente**, mantendo o JSON, os IDs e a confirmação. Cada execução continua após os lotes já concluídos. Não é necessário deixar a janela de uma planilha aberta.
5. Continue até aparecer `complete: true`. `consultarInstalacao` permite consultar o progresso sem escrever.

Pacotes grandes podem exigir várias execuções. Uma pausa não significa perda de progresso. Se houver falha de conexão após um lote ser aplicado, a próxima execução reconhece a marca gravada junto com aquele lote e não o repete. Durante uma instalação incompleta, nomes temporários de abas e uma configuração regional temporária podem aparecer. Conclua a instalação antes de usar as planilhas.

Se você trocar um ID ou o JSON, execute novamente `prepararInstalacao`. Não tente reaproveitar uma confirmação antiga. Se tiver alterado ou removido abas, reimporte os XLSX em cópias novas.

## 4. Autorizar conexões e conferir resultados

1. Abra as planilhas na ordem informada no guia do módulo: normalmente operacional, base auxiliar e painéis.
2. Nas células com `IMPORTRANGE` que exibem `#REF!`, clique na célula e em **Permitir acesso**, quando o Google apresentar esse botão. Uma mesma cópia pode exigir autorização para mais de uma origem.
3. Aguarde o recálculo e confira os indicadores, listas e gráficos. Faça uma mudança simples em um dado fictício de entrada e verifique se o resultado dependente acompanha a alteração. Depois restaure o exemplo ou comece a preencher seus próprios dados.
4. Depois de os dados aparecerem, volte ao Apps Script e execute **`restaurarGraficos`**. O Google pode descartar cores, rótulos e eixos quando um gráfico é configurado antes de suas fontes estarem disponíveis. Essa função reaplica somente os gráficos originais do manifesto, sem alterar fórmulas, entradas ou dimensões. Se executada com fontes ainda em `#REF!`, aguarde os dados e repita a função.
5. Confira também seletores e validações. Erros de fórmula descritos no relatório de verificação do módulo podem ser herdados do original e devem ser avaliados separadamente.

`complete: true` significa que todos os lotes de restauração foram aplicados. **Não significa que as conexões foram autorizadas nem que os resultados foram recalculados e validados.** Essas verificações dependem das cópias na sua conta. O script não tenta conceder autorização de `IMPORTRANGE` automaticamente.

Após conferir a instalação, você pode renomear os arquivos. Não execute novamente o instalador em planilhas que já receberam dados de produção. Mantenha o ZIP original guardado para criar novas cópias quando precisar.

## O que o pacote preserva e seus limites

- As fórmulas listadas no manifesto são gravadas como fórmulas, sem substituí-las por valores de cache. As demais fórmulas permanecem no transporte XLSX.
- O instalador restaura as propriedades de abas e as requisições explicitamente listadas no manifesto. Gráficos e formatos não listados dependem do que foi preservado na importação do XLSX; consulte o relatório específico do módulo.
- Scripts vinculados às planilhas originais, gatilhos, permissões e conexões autorizadas não são transportados pelo formato XLSX.
- Os modelos públicos usam dados fictícios. As fontes institucionais originais não são necessárias para instalar o pacote.

Referências técnicas: [serviço avançado Google Sheets](https://developers.google.com/apps-script/advanced/sheets), [requisições da Sheets API](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request), [limites da Sheets API](https://developers.google.com/workspace/sheets/api/limits) e [limites do Apps Script](https://developers.google.com/apps-script/guides/services/quotas).
