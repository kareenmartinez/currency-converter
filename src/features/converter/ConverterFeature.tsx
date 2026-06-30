import { PageError } from "@/components/errors/PageError";
import { StatusMessage } from "@/components/loading/StatusMessage";

import { ConverterView } from "./components/ConverterView";
import { useCurrencies } from "./hooks/useCurrencies";

export function ConverterFeature() {
  const currencies = useCurrencies();

  if (currencies.isPending) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-lg max-md:p-6">
        <StatusMessage message="Loading currencies..." />
      </div>
    );
  }

  if (currencies.isError) {
    return (
      <PageError
        title="Unable to load currencies"
        message="We couldn't load the currency list. Please try again."
        onRetry={currencies.refetch}
        isRetrying={currencies.isRefetching}
      />
    );
  }

  return <ConverterView currencyList={currencies.data} />;
}
