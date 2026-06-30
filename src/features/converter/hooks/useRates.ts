import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchExchangeRates } from "@/services/converter";

export function useRates(baseCurrency: string, enabled = true) {
  const query = useQuery({
    queryKey: ["converter", "rates", baseCurrency],
    queryFn: ({ signal }) => fetchExchangeRates(baseCurrency, signal),
    enabled,
    placeholderData: keepPreviousData,
  });

  const rates =
    query.data?.base === baseCurrency ? query.data : undefined;

  return {
    rates,
    isError: query.isError && rates == null,
    isLoading: rates == null && query.isFetching,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
