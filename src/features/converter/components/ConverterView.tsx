import { AmountInput } from "@/components/AmountInput";
import { FormattedNumber } from "@/components/FormattedNumber";
import type { SelectOption } from "@/components/SelectField";
import { SelectField } from "@/components/SelectField";
import { InlineError } from "@/components/errors/InlineError";
import { StatusMessage } from "@/components/loading/StatusMessage";
import { SwapButton } from "@/components/SwapButton";
import type { RatesState } from "../types";

import { ConversionResultView } from "./ConversionResultView";

type FormProps = {
  amount: number;
  amountDraft: string;
  fromCurrency: string;
  toCurrency: string;
  fromSymbol: string;
  fromName: string;
  toName: string;
  fromOptions: SelectOption[];
  toOptions: SelectOption[];
  onAmountChange: (value: string) => void;
  setFromCurrency: (value: string) => void;
  setToCurrency: (value: string) => void;
  swapCurrencies: () => void;
};

type Props = {
  form: FormProps;
  rates: RatesState;
};

function renderRatesSection(rates: RatesState, fromAmount: number) {
  switch (rates.status) {
    case "error":
      return (
        <InlineError
          title="Unable to load exchange rates"
          message="We couldn't load exchange rates for this currency. Please try again."
          onRetry={rates.onRetry}
          isRetrying={rates.isRetrying}
        />
      );
    case "loading":
      return <StatusMessage message="Loading exchange rates..." />;
    case "ready":
      return (
        <ConversionResultView result={rates.result} fromAmount={fromAmount} />
      );
    case "idle":
      return <p>No rates available</p>;
    default: {
      const _exhaustive: never = rates;
      return _exhaustive;
    }
  }
}

export function ConverterView({ form, rates }: Props) {
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
  } = form;

  return (
    <>
      <h1 className="hero-title mb-8 text-center">
        <FormattedNumber value={amount} /> {fromCurrency} to {toCurrency} - Convert{" "}
        {fromName} to {toName}
      </h1>

      <div className="rounded-2xl bg-white p-8 shadow-lg max-md:p-6">
        <form
          className="grid w-full min-w-0 grid-cols-[1fr_1fr_auto_1fr] items-end gap-x-8 gap-y-6 max-md:grid-cols-1 max-md:gap-6"
          onSubmit={(event) => event.preventDefault()}
        >
          <AmountInput
            id="amount"
            label="Amount"
            value={amountDraft}
            prefix={fromSymbol}
            onChange={onAmountChange}
          />

          <SelectField
            id="fromCurrency"
            label="From"
            value={fromCurrency}
            options={fromOptions}
            onChange={setFromCurrency}
          />

          <SwapButton onClick={swapCurrencies} />

          <SelectField
            id="toCurrency"
            label="To"
            value={toCurrency}
            options={toOptions}
            onChange={setToCurrency}
          />
        </form>

        <div className="rates-section">{renderRatesSection(rates, amount)}</div>
      </div>
    </>
  );
}
