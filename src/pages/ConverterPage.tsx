import { useMemo, type ReactNode } from "react";

import { PageError } from "@/components/errors/PageError";
import { StatusMessage } from "@/components/loading/StatusMessage";
import { ConverterFeature } from "@/features/converter/ConverterFeature";
import { useConverter } from "@/hooks/useConverter";
import { useCurrencies } from "@/hooks/useCurrencies";
import { useRates } from "@/hooks/useRates";
import { buildConversionResult } from "@/utils/convert";

export function ConverterPage() {
  const {
    currencies,
    isLoading: isLoadingCurrencies,
    isError: currenciesError,
    refetch: refetchCurrencies,
    isRefetching: isRefetchingCurrencies,
  } = useCurrencies();

  const {
    amount,
    fromCurrency,
    toCurrency,
    fromSymbol,
    fromOptions,
    toOptions,
    onAmountChange,
    setFromCurrency,
    setToCurrency,
    swapCurrencies,
  } = useConverter(currencies);

  const {
    rates,
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
        rates
      ),
    [amount, fromCurrency, toCurrency, currencies, rates]
  );

  const shell = (content: ReactNode) => (
    <div className="relative min-h-(--content-height) overflow-x-hidden">
      <div className="absolute inset-x-0 top-0 h-(--content-half) bg-brand" />
      <div className="absolute inset-x-0 bottom-0 h-(--content-half) bg-white" />

      <div className="relative z-10 flex min-h-(--content-height) w-full items-center justify-center px-(--page-gutter) py-12">
        <div className="w-full max-w-6xl min-w-0">{content}</div>
      </div>
    </div>
  );

  if (isLoadingCurrencies) {
    return shell(
      <div className="rounded-2xl bg-white p-8 shadow-lg max-md:p-6">
        <StatusMessage message="Loading currencies..." />
      </div>
    );
  }

  if (currenciesError) {
    return shell(
      <PageError
        title="Unable to load currencies"
        message="We couldn't load the currency list. Please try again."
        onRetry={refetchCurrencies}
        isRetrying={isRefetchingCurrencies}
      />
    );
  }

  return shell(
    <ConverterFeature
      result={result}
      amount={amount}
      fromCurrency={fromCurrency}
      toCurrency={toCurrency}
      fromSymbol={fromSymbol}
      fromOptions={fromOptions}
      toOptions={toOptions}
      onAmountChange={onAmountChange}
      setFromCurrency={setFromCurrency}
      setToCurrency={setToCurrency}
      swapCurrencies={swapCurrencies}
      ratesError={ratesError}
      isLoadingRates={isLoadingRates}
      onRetryRates={refetchRates}
      isRetryingRates={isRetryingRates}
    />
  );
}
