import { AmountInput } from "@/components/AmountInput";
import { FormattedNumber } from "@/components/FormattedNumber";
import { SelectField } from "@/components/SelectField";
import { SwapButton } from "@/components/SwapButton";
import { useConverter } from "@/features/converter/hooks/useConverter";
import type { CurrenciesResponse } from "../types";

import { ConversionResultView } from "./ConversionResultView";

type Props = {
  currencyList: CurrenciesResponse;
};

export function ConverterView({ currencyList }: Props) {
  const form = useConverter(currencyList).form;

  return (
    <>
      <h1 className="hero-title mb-8 text-center">
        <FormattedNumber value={form.amount.value} /> {form.from.value} to{" "}
        {form.to.value} - Convert {form.from.name} to {form.to.name}
      </h1>

      <div className="rounded-2xl bg-white p-8 shadow-lg max-md:p-6">
        <form
          className="grid w-full min-w-0 grid-cols-[1fr_1fr_auto_1fr] items-end gap-x-8 gap-y-6 max-md:grid-cols-1 max-md:gap-6"
          onSubmit={(event) => event.preventDefault()}
        >
          <AmountInput
            id="amount"
            label="Amount"
            value={form.amount.draft}
            prefix={form.from.symbol}
            onChange={form.amount.onChange}
          />

          <SelectField
            id="fromCurrency"
            label="From"
            value={form.from.value}
            options={form.from.options}
            onChange={form.from.onChange}
          />

          <SwapButton onClick={form.swap} />

          <SelectField
            id="toCurrency"
            label="To"
            value={form.to.value}
            options={form.to.options}
            onChange={form.to.onChange}
          />
        </form>

        <div className="rates-section">
          <ConversionResultView
            fromCurrency={form.from.value}
            toCurrency={form.to.value}
            amount={form.amount.value}
            currencyList={currencyList}
          />
        </div>
      </div>
    </>
  );
}
