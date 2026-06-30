import { AmountInput } from "@/components/AmountInput";
import { FormattedNumber } from "@/components/FormattedNumber";
import type { SelectOption } from "@/components/SelectField";
import { SelectField } from "@/components/SelectField";
import { InlineError } from "@/components/errors/InlineError";
import { StatusMessage } from "@/components/loading/StatusMessage";
import { SwapButton } from "@/components/SwapButton";
import type { ConversionResult } from "@/utils/convert";
import { formatLastUpdated } from "@/utils/format";

type Props = {
  result: ConversionResult | null;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  fromSymbol: string;
  fromOptions: SelectOption[];
  toOptions: SelectOption[];
  onAmountChange: (value: string) => void;
  setFromCurrency: (value: string) => void;
  setToCurrency: (value: string) => void;
  swapCurrencies: () => void;
  ratesError: boolean;
  isLoadingRates: boolean;
  onRetryRates: () => void;
  isRetryingRates: boolean;
};

export function ConverterFeature({
  result,
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
  ratesError,
  isLoadingRates,
  onRetryRates,
  isRetryingRates,
}: Props) {
  return (
    <>
      {result && (
        <h1 className="hero-title mb-8 text-center">
          <FormattedNumber value={result.fromAmount} /> {result.fromCurrency} to{" "}
          {result.toCurrency} {`- Convert ${result.fromName} to ${result.toName}`}
        </h1>
      )}

      <div className="rounded-2xl bg-white p-8 shadow-lg max-md:p-6">
        <form
          className="grid w-full min-w-0 grid-cols-[1fr_1fr_auto_1fr] items-end gap-x-8 gap-y-6 max-md:grid-cols-1 max-md:gap-6"
          onSubmit={(event) => event.preventDefault()}
        >
          <AmountInput
            id="amount"
            label="Amount"
            value={amount}
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

        <div className="rates-section">
          {ratesError && (
            <InlineError
              title="Unable to load exchange rates"
              message="We couldn't load exchange rates for this currency. Please try again."
              onRetry={onRetryRates}
              isRetrying={isRetryingRates}
            />
          )}

          {!ratesError && isLoadingRates && (
            <StatusMessage message="Loading exchange rates..." />
          )}

          {!ratesError && !isLoadingRates && result?.toAmount != null && (
            <>
              <div className="rates-layout">
                <div className="min-w-0 flex-1">
                  <div className="space-y-1 max-md:space-y-4">
                    <div className="rate-line">
                      <FormattedNumber value={result.fromAmount} fractionDigits={2} />
                      <span className="shrink-0">{result.fromName} =</span>
                    </div>

                    <div className="rate-line">
                      <FormattedNumber value={result.toAmount} fractionDigits={6} />
                      <span className="shrink-0">{result.toName}</span>
                    </div>
                  </div>

                  {result.inverseRateLabel && (
                    <p className="mt-4 text-sm text-gray-500">
                      {result.inverseRateLabel}
                    </p>
                  )}
                </div>

                <aside className="min-w-0 w-full max-w-[26rem] shrink rounded-xl bg-info p-6 max-md:hidden">
                  <p className="text-base leading-relaxed text-gray-900">
                    We use the mid-market rate for our Converter. This is for informational
                    purposes only. You won&apos;t receive this rate when sending money.
                  </p>
                </aside>
              </div>

              {result.lastUpdated && (
                <p className="rates-footer">
                  <span className="underline underline-offset-2">{result.fromName}</span> to{" "}
                  <span className="underline underline-offset-2">{result.toName}</span>{" "}
                  conversion — Last updated {formatLastUpdated(result.lastUpdated)}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
