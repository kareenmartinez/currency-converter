import { useQuery } from "@tanstack/react-query";

import { fetchCurrencies } from "@/services/converter";

export function useCurrencies() {
  return useQuery({
    queryKey: ["converter", "currencies"],
    queryFn: fetchCurrencies,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
