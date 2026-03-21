import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/api-client"
import type {
  ProjectsListResponse,
  ProjectDetail,
  RepositoryHealth,
} from "@/types/projects"

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => apiGet<ProjectsListResponse>("/projects"),
  })
}

export function useProjectDetail(projectId: string) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => apiGet<ProjectDetail>(`/projects/${projectId}`),
    enabled: !!projectId,
  })
}

export function useRepositoryHealth(projectId: string, repositoryId: string) {
  return useQuery({
    queryKey: ["projects", projectId, "repos", repositoryId],
    queryFn: () =>
      apiGet<RepositoryHealth>(
        `/projects/${projectId}/repositories/${repositoryId}`
      ),
    enabled: !!projectId && !!repositoryId,
  })
}
