import { getEnvConfig } from "./env"

const config = getEnvConfig()

export const API_BASE_URL = config.API_BASE_URL
export const SSO_AUTHORITY_URL = config.SSO_AUTHORITY_URL
export const SSO_CLIENT_ID = "helios-ui"

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
