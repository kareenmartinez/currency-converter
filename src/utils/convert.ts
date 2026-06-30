import type {
  CurrenciesResponse,
  ExchangeRatesResponse,
} from "@/services/converter";
import { exchangeRateFormat, formatNumber } from "@/utils/format";

export type ConversionResult = {
  fromAmount: number;
  fromCurrency: string;
  fromName: string;
  toAmount: number | null;
  toCurrency: string;
  toName: string;
  inverseRateLabel: string | null;
  lastUpdated?: string;
};

export function buildConversionResult(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  currencies?: CurrenciesResponse,
  exchangeRates?: ExchangeRatesResponse
): ConversionResult | null {
  if (!currencies) return null;

  const fromAmount = Number.isFinite(amount) && amount >= 0 ? amount : 0;
  const rate =
    exchangeRates?.base === fromCurrency
      ? exchangeRates.rates[toCurrency]
      : undefined;

  const inverseRate = rate != null ? 1 / rate : null;
  const showInverseRate =
    inverseRate != null && fromCurrency !== toCurrency;

  return {
    fromAmount,
    fromCurrency,
    fromName: currencies[fromCurrency]?.name ?? fromCurrency,
    toAmount: rate != null ? fromAmount * rate : null,
    toCurrency,
    toName: currencies[toCurrency]?.name ?? toCurrency,
    inverseRateLabel: showInverseRate
      ? `1 ${toCurrency} = ${formatNumber(inverseRate, exchangeRateFormat)} ${fromCurrency}`
      : null,
    lastUpdated: exchangeRates?.date,
  };
}
