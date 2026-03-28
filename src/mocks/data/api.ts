import type { ApiStats, ApiFilters, ApiRawResult } from "@/types/api"

export const apiStats: ApiStats = {
  apis_count: 320,
  services_count: 15,
}

export const apiFilters: ApiFilters = {
  methods: [
    { id: "GET", display_name: "GET" },
    { id: "POST", display_name: "POST" },
    { id: "PUT", display_name: "PUT" },
    { id: "DELETE", display_name: "DELETE" },
    { id: "PATCH", display_name: "PATCH" },
  ],
  services: [
    { id: "identity-service", display_name: "Identity Service" },
    { id: "payments-api", display_name: "Payments API" },
    { id: "notifications-service", display_name: "Notifications Service" },
    { id: "analytics-api", display_name: "Analytics API" },
    { id: "user-service", display_name: "User Service" },
    { id: "mobile-bff", display_name: "Mobile BFF" },
    { id: "search-api", display_name: "Search API" },
    { id: "billing-service", display_name: "Billing Service" },
  ],
}

export const apiSearchStreamingResponse = {
  chunks: [
    "The **user creation** endpoint is available in the Identity Service.\n\n",
    "## `POST /api/users`\n\n",
    "This endpoint creates a new user account with the provided details. ",
    "It performs the following steps:\n\n",
    "1. Validates the request payload (email format, password strength)\n",
    "2. Checks for existing accounts with the same email\n",
    "3. Hashes the password using bcrypt with a cost factor of 12\n",
    "4. Creates the user record in the database\n",
    "5. Sends a verification email via the Notifications Service\n\n",
    "> **Important:** The `email` field must be unique across the system. ",
    "Attempting to register a duplicate email returns a `409 Conflict` response.\n\n",
    "### Request Body\n\n",
    "```json\n",
    "{\n",
    '  "email": "user@example.com",\n',
    '  "password": "securePassword123",\n',
    '  "first_name": "Jane",\n',
    '  "last_name": "Doe"\n',
    "}\n",
    "```\n\n",
    "### Response (201 Created)\n\n",
    "```json\n",
    "{\n",
    '  "id": "usr_abc123",\n',
    '  "email": "user@example.com",\n',
    '  "status": "pending_verification"\n',
    "}\n",
    "```\n\n",
    "---\n\n",
    "### Error Responses\n\n",
    "| Status | Error Code | Description |\n",
    "| --- | --- | --- |\n",
    "| `400` | `VALIDATION_ERROR` | Missing or invalid fields in the request body |\n",
    "| `409` | `DUPLICATE_EMAIL` | An account with this email already exists |\n",
    "| `429` | `RATE_LIMITED` | Too many requests from this IP address |\n",
    "| `503` | `SERVICE_UNAVAILABLE` | Notifications service is unreachable |\n\n",
    "### Authentication\n\n",
    "This is a *public endpoint* — no `Authorization` header is required. ",
    "However, all other `/api/users/*` endpoints require a valid Bearer token.\n\n",
    "Rate limited to **10 requests per minute** per IP address. ",
    "See the [Rate Limiting Guide](/docs/rate-limiting) for details.",
  ],
  sources: [
    { service: "identity-service", method: "POST", path: "/api/users" },
    {
      service: "identity-service",
      method: "GET",
      path: "/api/users/:id",
    },
    {
      service: "notifications-service",
      method: "POST",
      path: "/api/notifications/email",
    },
  ],
}

export const apiRawResults: ApiRawResult[] = [
  {
    service: "identity-service",
    path: "/api/identity/v1/users",
    method: "post",
    summary: "Create user account",
    generated_semantic_summary:
      "**Intent:** Create a new user account.\n**Input:** JSON payload with `email`, `password`, `first_name`, `last_name`.\n**Output:** Created user object with `id`, `email`, `status`.",
    link: "https://backstage.devtools-internal.com/catalog/default/api/identity-service/definition",
    source: "backstage",
    match_score: 0.95,
    api_spec: {
      "/api/identity/v1/users": {
        post: {
          summary: "Create user account",
          parameters: [
            {
              name: "CreateUserRequest",
              in: "body",
              required: true,
              schema: {
                type: "object",
                required: ["email", "password", "first_name", "last_name"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  password: { type: "string" },
                  first_name: { type: "string" },
                  last_name: { type: "string" },
                },
              },
            },
          ],
          responses: {
            "201": { description: "User created successfully" },
            "409": { description: "Email already exists" },
          },
        },
      },
    },
  },
  {
    service: "identity-service",
    path: "/api/identity/v1/users/:id",
    method: "get",
    summary: "Retrieve user profile",
    generated_semantic_summary:
      "**Intent:** Retrieve a user profile by ID.\n**Input:** User ID as path parameter.\n**Output:** Full user profile object.",
    link: "https://backstage.devtools-internal.com/catalog/default/api/identity-service/definition",
    source: "backstage",
    match_score: 0.82,
    api_spec: {},
  },
  {
    service: "identity-service",
    path: "/api/identity/v1/users/:id",
    method: "put",
    summary: "Update user profile",
    generated_semantic_summary:
      "**Intent:** Update user profile information.\n**Input:** User ID + JSON payload with fields to update.\n**Output:** Updated user profile.",
    link: "https://backstage.devtools-internal.com/catalog/default/api/identity-service/definition",
    source: "backstage",
    match_score: 0.78,
    api_spec: {},
  },
  {
    service: "identity-service",
    path: "/api/identity/v1/users/:id",
    method: "delete",
    summary: "Deactivate user account",
    generated_semantic_summary:
      "**Intent:** Soft-delete a user account.\n**Input:** User ID as path parameter.\n**Output:** Confirmation of deactivation.",
    link: "https://backstage.devtools-internal.com/catalog/default/api/identity-service/definition",
    source: "backstage",
    match_score: 0.71,
    api_spec: {},
  },
  {
    service: "identity-service",
    path: "/api/identity/v1/users/:id/verify",
    method: "post",
    summary: "Verify user email",
    generated_semantic_summary:
      "**Intent:** Verify a user's email address using a token.\n**Input:** User ID + verification token.\n**Output:** Verification status.",
    link: "https://backstage.devtools-internal.com/catalog/default/api/identity-service/definition",
    source: "backstage",
    match_score: 0.68,
    api_spec: {},
  },
  {
    service: "identity-service",
    path: "/api/identity/v1/users/:id/password",
    method: "patch",
    summary: "Change user password",
    generated_semantic_summary:
      "**Intent:** Change a user's password.\n**Input:** Current password + new password.\n**Output:** Success confirmation.",
    link: "https://backstage.devtools-internal.com/catalog/default/api/identity-service/definition",
    source: "backstage",
    match_score: 0.62,
    api_spec: {},
  },
  {
    service: "user-service",
    path: "/api/users/v1/search",
    method: "get",
    summary: "Search users",
    generated_semantic_summary:
      "**Intent:** Search for users by name, email, or role.\n**Input:** Query parameters for search criteria.\n**Output:** Paginated list of matching users.",
    link: "https://backstage.devtools-internal.com/catalog/default/api/user-service/definition",
    source: "backstage",
    match_score: 0.55,
    api_spec: {},
  },
  {
    service: "notifications-service",
    path: "/api/notifications/v1/email",
    method: "post",
    summary: "Send transactional email",
    generated_semantic_summary:
      "**Intent:** Send a transactional email to a user.\n**Input:** Recipient, template ID, and template variables.\n**Output:** Delivery confirmation with message ID.",
    link: "https://backstage.devtools-internal.com/catalog/default/api/notifications-service/definition",
    source: "backstage",
    match_score: 0.41,
    api_spec: {},
  },
]
