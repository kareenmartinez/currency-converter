export type Currency = {
  name: string;
  symbol: string;
  currency_symbol: string;
};

export type CurrenciesResponse = Record<string, Currency>;

export type ExchangeRatesResponse = {
  date: string;
  base: string;
  rates: Record<string, number>;
};
