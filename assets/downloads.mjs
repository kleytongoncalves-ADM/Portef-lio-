// The ZIP is the complete distribution unit for each connected Sheets system.
export const downloads = Object.freeze({
  facilities: { format: 'google-sheets', components: 4, package: 'downloads/facilities/facilities-pacote-google-planilhas.zip' },
  imoveis: { format: 'google-sheets', components: 3, package: 'downloads/imoveis/imoveis-pacote-google-planilhas.zip' },
  frota: { format: 'google-sheets', components: 3, package: 'downloads/frota/frota-pacote-google-planilhas.zip' },
  estacionamento: { format: 'google-sheets', components: 4, package: 'downloads/estacionamento/estacionamento-pacote-google-planilhas.zip' },
  precos: { format: 'xlsm', components: 1, package: 'downloads/precos/mapa-preco-pacote-publico.zip', model: 'downloads/precos/mapa-preco-modelo-publico.xlsm' },
});
