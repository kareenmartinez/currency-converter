import { PageError } from "@/components/errors/PageError";
import { StatusMessage } from "@/components/loading/StatusMessage";

import { ConverterView } from "./components/ConverterView";
import { useConverterController } from "./hooks/useConverterController";

export function ConverterFeature() {
  const { status, retryCurrencies, isRetryingCurrencies, form, rates } =
    useConverterController();

  if (status === "loading") {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-lg max-md:p-6">
        <StatusMessage message="Loading currencies..." />
      </div>
    );
  }

  if (status === "error") {
    return (
      <PageError
        title="Unable to load currencies"
        message="We couldn't load the currency list. Please try again."
        onRetry={retryCurrencies}
        isRetrying={isRetryingCurrencies}
      />
    );
  }

  return <ConverterView form={form} rates={rates} />;
}
