import { httpClient } from "@/config/httpClient";
import type {
  CurrenciesResponse,
  ExchangeRatesResponse,
} from "@/features/converter/types";

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

export { fetchCurrencies, fetchExchangeRates };
