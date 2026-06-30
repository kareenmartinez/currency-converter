import { useQuery } from "@tanstack/react-query";

import { fetchCurrencies } from "@/services/converter";

export function useCurrencies() {
  const query = useQuery({
    queryKey: ["converter", "currencies"],
    queryFn: fetchCurrencies,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    currencies: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
