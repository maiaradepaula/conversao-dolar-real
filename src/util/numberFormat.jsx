export const numberFormat = (value, languageCode, currency) =>
  new Intl.NumberFormat(languageCode).format(value);