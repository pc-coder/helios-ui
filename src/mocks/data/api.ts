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
    "Rate limited to **10 requests per minute** per IP address.",
  ],
  sources: [
    { service: "identity-service", method: "POST", path: "/api/users" },
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
    method: "POST",
    path: "/api/users",
    summary: "Creates a new user account with email verification",
    score: 0.95,
  },
  {
    service: "identity-service",
    method: "GET",
    path: "/api/users/:id",
    summary: "Retrieves user profile by ID",
    score: 0.82,
  },
  {
    service: "identity-service",
    method: "PUT",
    path: "/api/users/:id",
    summary: "Updates user profile information",
    score: 0.78,
  },
  {
    service: "identity-service",
    method: "DELETE",
    path: "/api/users/:id",
    summary: "Deactivates a user account (soft delete)",
    score: 0.71,
  },
  {
    service: "identity-service",
    method: "POST",
    path: "/api/users/:id/verify",
    summary: "Verifies user email address with token",
    score: 0.68,
  },
  {
    service: "identity-service",
    method: "PATCH",
    path: "/api/users/:id/password",
    summary: "Changes user password with current password verification",
    score: 0.62,
  },
  {
    service: "user-service",
    method: "GET",
    path: "/api/users/search",
    summary: "Search users by name, email, or role",
    score: 0.55,
  },
  {
    service: "notifications-service",
    method: "POST",
    path: "/api/notifications/email",
    summary: "Sends a transactional email to a user",
    score: 0.41,
  },
]
