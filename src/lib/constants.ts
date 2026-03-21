export const API_BASE_URL = "/api/helios/v1"

export const ROUTES = {
  DASHBOARD: "/",
  CODE_SEARCH: "/code",
  API_SEARCH: "/apis",
  PROJECTS: "/projects",
  PROJECT_DETAIL: "/projects/:projectId",
  REPOSITORY_HEALTH: "/projects/:projectId/repos/:repositoryId",
  LOGIN: "/login",
  AUTH_CALLBACK: "/auth/callback",
} as const

export const SSO_CLIENT_ID = "helios-ui"
export const SSO_AUTHORITY_URL = import.meta.env.DEV
  ? ""
  : "https://sso.example.com"
