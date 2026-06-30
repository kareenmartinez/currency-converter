import { useCallback, useMemo, useState } from "react";

import type { SelectOption } from "@/components/SelectField";
import type { CurrenciesResponse, ConverterForm } from "@/features/converter/types";
import { parseNumber } from "@/utils/format";

const AMOUNT_DRAFT_PATTERN = /^\d*\.?\d*$/;

export function useConverter(currencies: CurrenciesResponse) {
  const [amountDraft, setAmountDraft] = useState("1");
  const amount = parseNumber(amountDraft);
  const [fromCurrency, setFromCurrencyState] = useState("USD");
  const [toCurrency, setToCurrencyState] = useState("EUR");

  const currencyOptions = useMemo<SelectOption[]>(
    () =>
      Object.entries(currencies).map(([value, currency]) => ({
        value,
        label: currency.name,
      })),
    [currencies]
  );

  const fromOptions = useMemo(
    () =>
      currencyOptions.map((option) => ({
        ...option,
        disabled: option.value === toCurrency,
      })),
    [currencyOptions, toCurrency]
  );

  const toOptions = useMemo(
    () =>
      currencyOptions.map((option) => ({
        ...option,
        disabled: option.value === fromCurrency,
      })),
    [currencyOptions, fromCurrency]
  );

  const fromSymbol = useMemo(
    () => currencies[fromCurrency]?.currency_symbol ?? fromCurrency,
    [currencies, fromCurrency]
  );

  const fromName = useMemo(
    () => currencies[fromCurrency]?.name ?? fromCurrency,
    [currencies, fromCurrency]
  );

  const toName = useMemo(
    () => currencies[toCurrency]?.name ?? toCurrency,
    [currencies, toCurrency]
  );

  const onAmountChange = useCallback((value: string) => {
    if (value !== "" && !AMOUNT_DRAFT_PATTERN.test(value)) return;
    setAmountDraft(value);
  }, []);

  const swapCurrencies = useCallback(() => {
    setFromCurrencyState(toCurrency);
    setToCurrencyState(fromCurrency);
  }, [fromCurrency, toCurrency]);

  const form: ConverterForm = {
    amount: {
      value: amount,
      draft: amountDraft,
      onChange: onAmountChange,
    },
    from: {
      value: fromCurrency,
      name: fromName,
      symbol: fromSymbol,
      options: fromOptions,
      onChange: setFromCurrencyState,
    },
    to: {
      value: toCurrency,
      name: toName,
      options: toOptions,
      onChange: setToCurrencyState,
    },
    swap: swapCurrencies,
  };

  return { form };
}
