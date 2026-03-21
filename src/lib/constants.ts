export const API_BASE_URL = "/api/helios/v1"

export const ROUTES = {
  DASHBOARD: "/",
  CODE_SEARCH: "/code",
  API_SEARCH: "/apis",
  PROJECTS: "/projects",
  PROJECT_DETAIL: "/projects/:projectId",
  REPOSITORY_HEALTH: "/projects/:projectId/repos/:repositoryId",
} as const
