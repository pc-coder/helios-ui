import { useQuery } from "@tanstack/react-query"
import { apiGet, apiPost } from "@/lib/api-client"
import type { ApiStats, ApiFilters, ApiRawSearchResponse } from "@/types/api"

export function useApiStats() {
  return useQuery({
    queryKey: ["api", "stats"],
    queryFn: () => apiGet<ApiStats>("/v1/api/stats"),
  })
}

export function useApiFilters() {
  return useQuery({
    queryKey: ["api", "filters"],
    queryFn: () => apiGet<ApiFilters>("/v1/api/filters"),
  })
}

export function useApiRawSearch(
  query: string,
  filters?: { method?: string; service?: string }
) {
  return useQuery({
    queryKey: ["api", "raw-search", query, filters],
    queryFn: () =>
      apiPost<ApiRawSearchResponse>("/v1/api/raw-search", { query, filters }),
    enabled: query.length > 0,
  })
}
