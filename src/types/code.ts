export interface CodeStats {
  projects_count: number
  repositories_count: number
  lines_of_code_indexed: number
  languages: string[]
}

export interface CodeFilterProject {
  id: string
  display_name: string
  repositories: CodeFilterRepository[]
}

export interface CodeFilterRepository {
  id: string
  display_name: string
}

export interface CodeFilters {
  projects: CodeFilterProject[]
}

export interface CodeSearchRequest {
  query: string
  filters?: {
    project?: string
    repository?: string
  }
}

export interface CodeSource {
  project: string
  repository: string
  file: string
  lines: string
}

export type CodeStreamEvent =
  | { type: "chunk"; content: string }
  | { type: "sources"; sources: CodeSource[] }
  | { type: "done" }
