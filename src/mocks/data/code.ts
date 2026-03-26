import type { CodeStats, CodeFilters } from "@/types/code"

export const codeStats: CodeStats = {
  projects_count: 12,
  repositories_count: 48,
  lines_of_code_indexed: 3_250_000,
  languages: ["Java", "Python", "Go", "TypeScript", "Kotlin", "Rust"],
}

export const codeFilters: CodeFilters = {
  projects: [
    {
      id: "payments",
      display_name: "Payments Platform",
      repositories: [
        { id: "payments-api", display_name: "Payments API" },
        { id: "payments-worker", display_name: "Payments Worker" },
        { id: "payments-sdk", display_name: "Payments SDK" },
      ],
    },
    {
      id: "identity",
      display_name: "Identity & Auth",
      repositories: [
        { id: "identity-service", display_name: "Identity Service" },
        { id: "auth-gateway", display_name: "Auth Gateway" },
      ],
    },
    {
      id: "notifications",
      display_name: "Notifications",
      repositories: [
        { id: "notifications-service", display_name: "Notifications Service" },
        { id: "notifications-worker", display_name: "Notifications Worker" },
      ],
    },
    {
      id: "data-platform",
      display_name: "Data Platform",
      repositories: [
        { id: "data-pipeline", display_name: "Data Pipeline" },
        { id: "data-warehouse", display_name: "Data Warehouse" },
        { id: "analytics-api", display_name: "Analytics API" },
      ],
    },
    {
      id: "mobile",
      display_name: "Mobile Gateway",
      repositories: [
        { id: "mobile-bff", display_name: "Mobile BFF" },
        { id: "mobile-push", display_name: "Mobile Push Service" },
      ],
    },
  ],
}

export const codeSearchStreamingResponse = {
  chunks: [
    "The **auth middleware** in the Payments API validates tokens using a ",
    "multi-step process.\n\n",
    "## Token Validation Flow\n\n",
    "1. The middleware first extracts the `Authorization` header from the incoming request\n",
    "2. It then decodes the JWT token using the public key from the identity service\n",
    "3. Claims are validated against the expected audience and issuer\n",
    "   - The `aud` claim must match the service name\n",
    "   - The `iss` claim must match the configured identity provider URL\n",
    "   - Token expiry (`exp`) is checked with a **30-second** clock skew tolerance\n\n",
    "```go\n",
    "func (m *AuthMiddleware) ValidateToken(ctx context.Context, token string) (*Claims, error) {\n",
    "    parsed, err := jwt.ParseWithClaims(token, &Claims{}, func(t *jwt.Token) (interface{}, error) {\n",
    "        return m.publicKey, nil\n",
    "    })\n",
    "    if err != nil {\n",
    '        return nil, fmt.Errorf("invalid token: %w", err)\n',
    "    }\n",
    "    claims := parsed.Claims.(*Claims)\n",
    "    if claims.Audience != m.expectedAudience {\n",
    "        return nil, ErrInvalidAudience\n",
    "    }\n",
    "    return claims, nil\n",
    "}\n",
    "```\n\n",
    "> **Note:** The public key is fetched from the identity service's ",
    "`/.well-known/jwks.json` endpoint and cached for 1 hour. ",
    "See `keystore.go` for the caching implementation.\n\n",
    "---\n\n",
    "## Error Handling\n\n",
    "The middleware returns different HTTP status codes depending on the failure:\n\n",
    "| Error | Status Code | Description |\n",
    "| --- | --- | --- |\n",
    "| Missing header | `401` | No `Authorization` header present |\n",
    "| Malformed token | `401` | Token cannot be decoded |\n",
    "| Expired token | `401` | Token `exp` claim is in the past |\n",
    "| Invalid audience | `403` | Token was issued for a different service |\n",
    "| Key fetch failure | `503` | Cannot reach identity service for JWKS |\n\n",
    "The middleware is registered in `server.go` and runs before all protected route handlers. ",
    "Token refresh is handled separately by the **Identity Service** via the `/auth/refresh` endpoint.\n\n",
    "For *local development*, you can bypass token validation by setting ",
    "the `AUTH_SKIP_VALIDATION=true` environment variable.",
  ],
  sources: [
    {
      project: "payments",
      repository: "payments-api",
      file: "middleware/auth.go",
      lines: "12-45",
    },
    {
      project: "payments",
      repository: "payments-api",
      file: "server.go",
      lines: "28-33",
    },
    {
      project: "payments",
      repository: "payments-api",
      file: "keystore.go",
      lines: "8-52",
    },
    {
      project: "identity",
      repository: "identity-service",
      file: "handlers/refresh.go",
      lines: "15-42",
    },
  ],
}
