import { useCallback, useMemo, useState } from "react";

import type { SelectOption } from "@/components/SelectField";
import type { CurrenciesResponse } from "@/features/converter/types";
import { parseNumber } from "@/utils/format";

const AMOUNT_DRAFT_PATTERN = /^\d*\.?\d*$/;

export function useConverter(currencies: CurrenciesResponse | undefined) {
  const [amountDraft, setAmountDraft] = useState("1");
  const amount = parseNumber(amountDraft);
  const [fromCurrency, setFromCurrencyState] = useState("USD");
  const [toCurrency, setToCurrencyState] = useState("EUR");

  const currencyOptions = useMemo<SelectOption[]>(
    () =>
      currencies
        ? Object.entries(currencies).map(([value, currency]) => ({
            value,
            label: currency.name,
          }))
        : [],
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
    () => currencies?.[fromCurrency]?.currency_symbol ?? fromCurrency,
    [currencies, fromCurrency]
  );

  const fromName = useMemo(
    () => currencies?.[fromCurrency]?.name ?? fromCurrency,
    [currencies, fromCurrency]
  );

  const toName = useMemo(
    () => currencies?.[toCurrency]?.name ?? toCurrency,
    [currencies, toCurrency]
  );

  const pickOtherCurrency = useCallback(
    (code: string) =>
      currencyOptions.find((option) => option.value !== code)?.value,
    [currencyOptions]
  );

  const onAmountChange = useCallback((value: string) => {
    if (value !== "" && !AMOUNT_DRAFT_PATTERN.test(value)) return;
    setAmountDraft(value);
  }, []);

  const setFromCurrency = useCallback(
    (code: string) => {
      setFromCurrencyState(code);

      if (code === toCurrency) {
        const fallback = pickOtherCurrency(code);
        if (fallback) setToCurrencyState(fallback);
      }
    },
    [toCurrency, pickOtherCurrency]
  );

  const setToCurrency = useCallback(
    (code: string) => {
      setToCurrencyState(code);

      if (code === fromCurrency) {
        const fallback = pickOtherCurrency(code);
        if (fallback) setFromCurrencyState(fallback);
      }
    },
    [fromCurrency, pickOtherCurrency]
  );

  const swapCurrencies = useCallback(() => {
    setFromCurrencyState(toCurrency);
    setToCurrencyState(fromCurrency);
  }, [fromCurrency, toCurrency]);

  return {
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
  };
}
