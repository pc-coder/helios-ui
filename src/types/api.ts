export interface ApiStats {
  apis_count: number
  services_count: number
}

export interface ApiFilterMethod {
  id: string
  display_name: string
}

export interface ApiFilterService {
  id: string
  display_name: string
}

export interface ApiFilters {
  methods: ApiFilterMethod[]
  services: ApiFilterService[]
}

export interface ApiSearchRequest {
  query: string
  filters?: {
    method?: string
    service?: string
  }
}

export interface ApiSource {
  service: string
  method: string
  path: string
}

export type ApiStreamEvent =
  | { type: "chunk"; content: string }
  | { type: "sources"; sources: ApiSource[] }
  | { type: "done" }

export interface ApiRawResult {
  service: string
  method: string
  path: string
  summary: string
  score: number
}

export interface ApiRawSearchResponse {
  results: ApiRawResult[]
}
