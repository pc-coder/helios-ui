import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/api-client"
import type { CodeStats, CodeFilters } from "@/types/code"

export function useCodeStats() {
  return useQuery({
    queryKey: ["code", "stats"],
    queryFn: () => apiGet<CodeStats>("/code/stats"),
  })
}

export function useCodeFilters() {
  return useQuery({
    queryKey: ["code", "filters"],
    queryFn: () => apiGet<CodeFilters>("/code/filters"),
  })
}
