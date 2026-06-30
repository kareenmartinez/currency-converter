import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { fetchExchangeRates } from "@/services/converter";

export function useRates(baseCurrency: string) {
  return useQuery({
    queryKey: ["converter", "rates", baseCurrency],
    queryFn: ({ signal }) => fetchExchangeRates(baseCurrency, signal),
    placeholderData: keepPreviousData,
  });
}
