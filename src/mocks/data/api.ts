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
    api_spec: {
      "/api/identity/v1/users/:id": {
        get: {
          summary: "Retrieve user profile",
          description: "Returns the full user profile for a given user ID, including nested address information.",
          tags: ["Users"],
          produces: ["application/json"],
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Unique user identifier" },
            { name: "Authorization", in: "header", type: "string", required: true, description: "Bearer token" },
          ],
          responses: {
            "200": {
              description: "User profile retrieved",
              schema: {
                type: "object",
                properties: {
                  id: { type: "string", example: "usr_abc123" },
                  email: { type: "string", example: "user@example.com" },
                  first_name: { type: "string", example: "Jane" },
                  last_name: { type: "string", example: "Doe" },
                  status: { type: "string", enum: ["active", "pending_verification", "deactivated"] },
                  address: {
                    type: "object",
                    properties: {
                      street: { type: "string", example: "123 Main St" },
                      city: { type: "string", example: "San Francisco" },
                      state: { type: "string", example: "CA" },
                      zip: { type: "string", example: "94105" },
                    },
                  },
                  created_at: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z" },
                },
              },
            },
            "404": { description: "User not found" },
          },
        },
      },
    },
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
    api_spec: {
      "/api/identity/v1/users/:id": {
        put: {
          summary: "Update user profile",
          tags: ["Users"],
          consumes: ["application/json"],
          produces: ["application/json"],
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Unique user identifier" },
            { name: "Authorization", in: "header", type: "string", required: true, description: "Bearer token" },
            {
              name: "UpdateUserRequest",
              in: "body",
              required: true,
              schema: {
                type: "object",
                properties: {
                  first_name: { type: "string", example: "Jane" },
                  last_name: { type: "string", example: "Doe" },
                  address: {
                    type: "object",
                    properties: {
                      street: { type: "string", example: "456 Oak Ave" },
                      city: { type: "string", example: "Los Angeles" },
                      state: { type: "string", example: "CA" },
                      zip: { type: "string", example: "90001" },
                    },
                  },
                },
              },
            },
          ],
          responses: {
            "200": { description: "User updated successfully" },
            "400": { description: "Invalid request body" },
            "404": { description: "User not found" },
          },
        },
      },
    },
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
    api_spec: {
      "/api/identity/v1/users/:id": {
        delete: {
          summary: "Deactivate user account",
          description: "Soft-deletes a user account. The user data is retained but the account is marked as deactivated.",
          tags: ["Users"],
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Unique user identifier" },
            { name: "Authorization", in: "header", type: "string", required: true, description: "Bearer token" },
          ],
          responses: {
            "204": { description: "User deactivated successfully" },
            "404": { description: "User not found" },
          },
        },
      },
    },
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
    api_spec: {
      "/api/identity/v1/users/:id/verify": {
        post: {
          summary: "Verify user email",
          tags: ["Users", "Verification"],
          consumes: ["application/json"],
          produces: ["application/json"],
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Unique user identifier" },
            {
              name: "VerifyEmailRequest",
              in: "body",
              required: true,
              schema: {
                type: "object",
                required: ["token"],
                properties: {
                  token: { type: "string", description: "Email verification token", example: "vrf_tok_abc123" },
                },
              },
            },
          ],
          responses: {
            "200": {
              description: "Email verified",
              schema: {
                type: "object",
                properties: {
                  verified: { type: "boolean", example: true },
                  verified_at: { type: "string", format: "date-time" },
                },
              },
            },
            "400": { description: "Invalid or expired token" },
          },
        },
      },
    },
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
    api_spec: {
      "/api/identity/v1/users/:id/password": {
        patch: {
          summary: "Change user password",
          tags: ["Users", "Security"],
          consumes: ["application/json"],
          parameters: [
            { name: "id", in: "path", type: "string", required: true, description: "Unique user identifier" },
            { name: "Authorization", in: "header", type: "string", required: true, description: "Bearer token" },
            {
              name: "ChangePasswordRequest",
              in: "body",
              required: true,
              schema: {
                type: "object",
                required: ["current_password", "new_password"],
                properties: {
                  current_password: { type: "string", description: "Current password for verification" },
                  new_password: { type: "string", description: "New password (min 8 chars, must include uppercase, number)" },
                },
              },
            },
          ],
          responses: {
            "204": { description: "Password changed successfully" },
            "400": { description: "New password does not meet requirements" },
            "401": { description: "Current password is incorrect" },
          },
        },
      },
    },
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
    api_spec: {
      "/api/users/v1/search": {
        get: {
          summary: "Search users",
          tags: ["Users", "Search"],
          produces: ["application/json"],
          parameters: [
            { name: "q", in: "query", type: "string", required: true, description: "Search query (name, email, or role)" },
            { name: "page", in: "query", type: "integer", description: "Page number (default: 1)" },
            { name: "limit", in: "query", type: "integer", description: "Results per page (default: 20, max: 100)" },
            { name: "role", in: "query", type: "string", enum: ["admin", "user", "viewer"], description: "Filter by user role" },
            { name: "Authorization", in: "header", type: "string", required: true, description: "Bearer token" },
          ],
          responses: {
            "200": {
              description: "Search results",
              schema: {
                type: "object",
                properties: {
                  total: { type: "integer", example: 42 },
                  page: { type: "integer", example: 1 },
                  limit: { type: "integer", example: 20 },
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "usr_abc123" },
                        email: { type: "string", example: "user@example.com" },
                        name: { type: "string", example: "Jane Doe" },
                        role: { type: "string", example: "admin" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
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
    api_spec: {
      "/api/notifications/v1/email": {
        post: {
          summary: "Send transactional email",
          description: "Sends a templated transactional email to one or more recipients.",
          tags: ["Email", "Notifications"],
          consumes: ["application/json"],
          produces: ["application/json"],
          parameters: [
            { name: "Authorization", in: "header", type: "string", required: true, description: "Bearer token" },
            { name: "x-idempotency-key", in: "header", type: "string", description: "Idempotency key to prevent duplicate sends" },
            {
              name: "SendEmailRequest",
              in: "body",
              required: true,
              schema: {
                type: "object",
                required: ["template_id", "recipients"],
                properties: {
                  template_id: { type: "string", example: "WELCOME_EMAIL", description: "Email template identifier" },
                  recipients: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        email: { type: "string", example: "user@example.com" },
                        name: { type: "string", example: "Jane Doe" },
                      },
                    },
                    description: "List of email recipients",
                  },
                  variables: {
                    type: "object",
                    additionalProperties: true,
                    description: "Template variable key-value pairs",
                  },
                  schedule_at: { type: "string", format: "date-time", description: "Optional future send time" },
                },
              },
            },
          ],
          responses: {
            "202": {
              description: "Email accepted for delivery",
              schema: {
                type: "object",
                properties: {
                  message_id: { type: "string", example: "msg_xyz789" },
                  status: { type: "string", example: "queued" },
                },
              },
            },
            "400": { description: "Invalid template or recipient" },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },
    },
  },
]
