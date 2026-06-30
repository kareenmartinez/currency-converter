import { useMemo } from "react";

import { hasAmount, type RatesState } from "@/features/converter/types";
import { buildConversionResult } from "@/features/converter/conversion";

import { useConverter } from "./useConverter";
import { useCurrencies } from "./useCurrencies";
import { useRates } from "./useRates";

export function useConverterController() {
  const {
    currencies,
    isLoading: isLoadingCurrencies,
    isError: currenciesError,
    refetch: refetchCurrencies,
    isRefetching: isRefetchingCurrencies,
  } = useCurrencies();

  const {
    amount,
    amountDraft,
    fromCurrency,
    toCurrency,
    fromSymbol,
    fromName,
    toName,
    fromOptions,
    toOptions,
    onAmountChange,
    setFromCurrency,
    setToCurrency,
    swapCurrencies,
  } = useConverter(currencies);

  const {
    rates: exchangeRates,
    isError: ratesError,
    isLoading: isLoadingRates,
    refetch: refetchRates,
    isRefetching: isRetryingRates,
  } = useRates(fromCurrency, Boolean(currencies));

  const result = useMemo(
    () =>
      buildConversionResult(
        amount,
        fromCurrency,
        toCurrency,
        currencies,
        exchangeRates
      ),
    [amount, fromCurrency, toCurrency, currencies, exchangeRates]
  );

  const status = isLoadingCurrencies
    ? "loading"
    : currenciesError
      ? "error"
      : "ready";

  const rates: RatesState = ratesError
    ? { status: "error", onRetry: refetchRates, isRetrying: isRetryingRates }
    : isLoadingRates
      ? { status: "loading" }
      : hasAmount(result)
        ? { status: "ready", result }
        : { status: "idle" };

  return {
    status,
    retryCurrencies: refetchCurrencies,
    isRetryingCurrencies: isRefetchingCurrencies,
    form: {
      amount,
      amountDraft,
      fromCurrency,
      toCurrency,
      fromSymbol,
      fromName,
      toName,
      fromOptions,
      toOptions,
      onAmountChange,
      setFromCurrency,
      setToCurrency,
      swapCurrencies,
    },
    rates,
  };
}
