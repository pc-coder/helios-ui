import { useQuery } from "@tanstack/react-query"
import { apiGet, apiPost } from "@/lib/api-client"
import type { ApiStats, ApiFilters, ApiRawSearchResponse } from "@/types/api"

export function useApiStats() {
  return useQuery({
    queryKey: ["api", "stats"],
    queryFn: () => apiGet<ApiStats>("/api/stats"),
  })
}

export function useApiFilters() {
  return useQuery({
    queryKey: ["api", "filters"],
    queryFn: () => apiGet<ApiFilters>("/api/filters"),
  })
}

export function useApiRawSearch(
  query: string,
  filters?: { method?: string; service?: string }
) {
  return useQuery({
    queryKey: ["api", "raw-search", query, filters],
    queryFn: () =>
      apiPost<ApiRawSearchResponse>("/api/raw-search", { query, filters }),
    enabled: query.length > 0,
  })
}
