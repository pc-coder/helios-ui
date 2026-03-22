export interface EnvironmentConfiguration {
  ENVIRONMENT: string
  API_BASE_URL: string
  SSO_CLIENT_ID: string
  SSO_AUTHORITY_URL: string
  SSO_TOKEN_URL: string
  SSO_USER_INFO_URL: string
  SSO_REDIRECT_URL: string
}

declare global {
  interface Window {
    environmentConfiguration: EnvironmentConfiguration
  }
}

export function getEnvConfig(): EnvironmentConfiguration {
  return (
    window.environmentConfiguration ?? {
      ENVIRONMENT: "local",
      API_BASE_URL: "/api/helios",
      SSO_CLIENT_ID: "helios-ui",
      SSO_AUTHORITY_URL: "",
      SSO_TOKEN_URL: "/api/helios/v1/token/exchange",
      SSO_USER_INFO_URL: "/api/helios/v1/user/info",
      SSO_REDIRECT_URL: "http://localhost:5173/helios/auth/callback",
    }
  )
}
