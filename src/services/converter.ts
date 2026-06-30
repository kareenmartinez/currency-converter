import { httpClient } from "@/config/httpClient";

type Currency = {
  name: string;
  symbol: string;
  currency_symbol: string;
};

type CurrenciesResponse = Record<string, Currency>;

type ExchangeRatesResponse = {
  date: string;
  base: string;
  rates: Record<string, number>;
};

const fetchCurrencies = async (): Promise<CurrenciesResponse> => {
  const { data } = await httpClient.get<CurrenciesResponse>("/currencies");

  return data;
};

const fetchExchangeRates = async (
  baseCurrency: string,
  signal?: AbortSignal
): Promise<ExchangeRatesResponse> => {
  const { data } = await httpClient.get<ExchangeRatesResponse>("/rates", {
    params: { base: baseCurrency },
    signal,
  });

  return data;
};

export type { CurrenciesResponse, Currency, ExchangeRatesResponse };
export { fetchCurrencies, fetchExchangeRates };
