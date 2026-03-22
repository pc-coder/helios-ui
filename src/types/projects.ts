export interface ProjectSummary {
  id: string
  display_name: string
  repositories_count: number
  open_prs_count: number
  open_issues_count: number
  stale_branches_count: number
  languages: string[]
}

export interface ProjectsListResponse {
  projects: ProjectSummary[]
}

export interface RepositorySummary {
  id: string
  display_name: string
  default_branch: string
  total_branches: number
  stale_branches_count: number
  open_prs_count: number
  open_issues_count: number
  languages: string[]
  pipelines_count: number
  large_files_count: number
}

export interface ProjectDetail {
  id: string
  display_name: string
  repositories: RepositorySummary[]
}

export interface Pipeline {
  name: string
  link: string
}

export interface Branch {
  name: string
  last_commit_timestamp: number
}

export interface SizeGroups {
  above_500kb: number
  above_1mb: number
  above_5mb: number
}

export interface RepositoryHealth {
  id: string
  display_name: string
  default_branch: string
  total_branches: number
  size_in_bytes: number
  count_of_files: number
  branches: Branch[]
  open_prs_count: number
  open_issues_count: number
  languages_stats: Record<string, number>
  pipelines: Pipeline[]
  size_groups: SizeGroups
}
