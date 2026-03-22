import { getEnvConfig } from "./env"

const config = getEnvConfig()

export const API_BASE_URL = config.API_BASE_URL

export const SSO_CONFIG = {
  CLIENT_ID: config.SSO_CLIENT_ID,
  AUTHORITY_URL: config.SSO_AUTHORITY_URL,
  TOKEN_URL: config.SSO_TOKEN_URL,
  USER_INFO_URL: config.SSO_USER_INFO_URL,
  REDIRECT_URL: config.SSO_REDIRECT_URL,
} as const

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
