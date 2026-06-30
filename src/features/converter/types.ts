import type { SelectOption } from "@/components/SelectField";

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

export type ConversionWithAmount = ConversionResult & { toAmount: number };

export function hasAmount(
  r: ConversionResult | null
): r is ConversionWithAmount {
  return r != null && r.toAmount != null;
}

export type ConverterForm = {
  amount: {
    value: number;
    draft: string;
    onChange: (value: string) => void;
  };
  from: {
    value: string;
    name: string;
    symbol: string;
    options: SelectOption[];
    onChange: (value: string) => void;
  };
  to: {
    value: string;
    name: string;
    options: SelectOption[];
    onChange: (value: string) => void;
  };
  swap: () => void;
};
