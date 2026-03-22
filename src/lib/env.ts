export interface EnvironmentConfiguration {
  ENVIRONMENT: string
  API_BASE_URL: string
  SSO_AUTHORITY_URL: string
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
      API_BASE_URL: "/api/helios/v1",
      SSO_AUTHORITY_URL: "",
    }
  )
}
