import { FormattedNumber } from "@/components/FormattedNumber";
import type { ConversionWithAmount } from "../types";
import { formatLastUpdated } from "@/utils/format";

type Props = {
  result: ConversionWithAmount;
  fromAmount: number;
};

export function ConversionResultView({ result, fromAmount }: Props) {
  return (
    <>
      <div className="rates-layout">
        <div className="min-w-0 flex-1">
          <div className="space-y-1 max-md:space-y-4">
            <div className="rate-line">
              <FormattedNumber value={fromAmount} fractionDigits={2} />
              <span className="shrink-0">{result.fromName} =</span>
            </div>

            <div className="rate-line">
              <FormattedNumber value={result.toAmount} fractionDigits={6} />
              <span className="shrink-0">{result.toName}</span>
            </div>
          </div>

          {result.inverseRateLabel && (
            <p className="mt-4 text-sm text-gray-500">{result.inverseRateLabel}</p>
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
  );
}
