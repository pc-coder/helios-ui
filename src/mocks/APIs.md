# Helios APIs

Base URL: `/api/helios/v1`

The application supports three domains: **Code Search**, **API Search**, and **Projects (Health Browse)**.

- **Search** endpoints are LLM-powered semantic searches that stream a synthesized response.
- **Raw Search** endpoints perform direct document retrieval via RFF search and return matching documents.

---

## Code Search

Base path: `/api/helios/v1/code`

### 1. Get Code Stats

```
GET /api/helios/v1/code/stats
```

**Response** `200 OK`
```json
{
  "projects_count": 12,
  "repositories_count": 48,
  "lines_of_code_indexed": 3250000,
  "languages": ["Java", "Python", "Go", "TypeScript"]
}
```

### 2. Search Code (LLM-powered, streaming)

```
POST /api/helios/v1/code/search
```

**Request**
```json
{
  "query": "how does the auth middleware validate tokens",
  "filters": {
    "project": "payments",
    "repository": "payments-api"
  }
}
```

- `query` (string, required) — natural language search query
- `filters.project` (string, optional) — filter by project name
- `filters.repository` (string, optional) — filter by repository name (a project can contain multiple repositories)

**Response** `200 OK` — `text/event-stream`
```
data: {"type": "chunk", "content": "The auth middleware in "}
data: {"type": "chunk", "content": "`middleware/auth.go` validates..."}
data: {"type": "sources", "sources": [{"project": "payments", "repository": "payments-api", "file": "middleware/auth.go", "lines": "12-35"}]}
data: {"type": "done"}
```

### 3. Raw Code Search (document retrieval)

```
POST /api/helios/v1/code/raw-search
```

**Request**
```json
{
  "query": "token validation middleware",
  "filters": {
    "project": "payments",
    "repository": "payments-api"
  }
}
```

- `query` (string, required) — search query
- `filters.project` (string, optional) — filter by project name
- `filters.repository` (string, optional) — filter by repository name

**Response** `200 OK`
```json
{
  "results": [
    {
      "project": "payments",
      "repository": "payments-api",
      "file": "middleware/auth.go",
      "lines": "12-35",
      "content": "func validateToken(token string) error { ... }",
      "score": 0.92
    }
  ]
}
```

### 4. Get Code Search Filters

```
GET /api/helios/v1/code/filters
```

**Response** `200 OK`
```json
{
  "projects": [
    {
      "id": "payments",
      "display_name": "Payments Platform",
      "repositories": [
        { "id": "payments-api", "display_name": "Payments API" },
        { "id": "payments-worker", "display_name": "Payments Worker" }
      ]
    },
    {
      "id": "identity",
      "display_name": "Identity & Auth",
      "repositories": [
        { "id": "identity-service", "display_name": "Identity Service" }
      ]
    },
    {
      "id": "notifications",
      "display_name": "Notifications",
      "repositories": [
        { "id": "notifications-service", "display_name": "Notifications Service" },
        { "id": "notifications-worker", "display_name": "Notifications Worker" }
      ]
    }
  ]
}
```

---

## API Search

Base path: `/api/helios/v1/api`

### 1. Get API Stats

```
GET /api/helios/v1/api/stats
```

**Response** `200 OK`
```json
{
  "apis_count": 320,
  "services_count": 15
}
```

### 2. Get API Search Filters

```
GET /api/helios/v1/api/filters
```

**Response** `200 OK`
```json
{
  "methods": [
    { "id": "GET", "display_name": "GET" },
    { "id": "POST", "display_name": "POST" },
    { "id": "PUT", "display_name": "PUT" },
    { "id": "DELETE", "display_name": "DELETE" },
    { "id": "PATCH", "display_name": "PATCH" }
  ],
  "services": [
    { "id": "identity-service", "display_name": "Identity Service" },
    { "id": "payments-api", "display_name": "Payments API" },
    { "id": "notifications-service", "display_name": "Notifications Service" }
  ]
}
```

### 3. Search APIs (LLM-powered, streaming)

```
POST /api/helios/v1/api/search
```

**Request**
```json
{
  "query": "endpoint to create a new user",
  "filters": {
    "method": "POST",
    "service": "identity-service"
  }
}
```

- `query` (string, required) — natural language search query
- `filters.method` (string, optional) — filter by HTTP method (e.g., GET, POST, PUT, DELETE)
- `filters.service` (string, optional) — filter by service name

**Response** `200 OK` — `text/event-stream`
```
data: {"type": "chunk", "content": "The user creation endpoint is "}
data: {"type": "chunk", "content": "`POST /api/users` in the identity service..."}
data: {"type": "sources", "sources": [{"service": "identity-service", "method": "POST", "path": "/api/users"}]}
data: {"type": "done"}
```

### 4. Raw API Search (document retrieval)

```
POST /api/helios/v1/api/raw-search
```

**Request**
```json
{
  "query": "create user",
  "filters": {
    "method": "POST",
    "service": "identity-service"
  }
}
```

- `query` (string, required) — search query
- `filters.method` (string, optional) — filter by HTTP method (e.g., GET, POST, PUT, DELETE)
- `filters.service` (string, optional) — filter by service name

**Response** `200 OK`
```json
{
  "results": [
    {
      "service": "customer-communication-gateway",
      "path": "/api/ccg/v1/email-template/create",
      "method": "post",
      "summary": "Create email template",
      "generated_semantic_summary": "Semantic Summary : **Intent:** Create a new email template in the Customer‑Communication‑Gateway service.  \n**Input:** A JSON payload that defines the email template (e.g., `name`, `subject`, `body`, optional placeholders/variables).  \n**Output:** A JSON response confirming creation, typically containing the generated `templateId`, `createdAt` timestamp, and a success `status`.  ",
      "link": "https://backstage.devtools-internal.com/catalog/default/api/customer-communication-gateway/definition",
      "source": "backstage",
      "match_score": 0.85,
      "api_spec": {
        "/api/ccg/v1/email-template/create": {
          "post": {
            "description": "API to create new email template",
            "consumes": [
              "application/json"
            ],
            "produces": [
              "application/json"
            ],
            "tags": [
              "Email",
              "template"
            ],
            "summary": "Create email template",
            "parameters": [
              {
                "type": "string",
                "description": "header value is  XMLHttpRequest",
                "name": "x-requested-with",
                "in": "header",
                "required": true
              },
              {
                "type": "string",
                "description": "header value is Prime authorisation bearer token",
                "name": "Authorization",
                "in": "header",
                "required": true
              },
              {
                "description": "Create Email Template Request",
                "name": "CreateEmailTemplateRequest",
                "in": "body",
                "required": true,
                "schema": {
                  "type": "object",
                  "required": [
                    "body",
                    "exclude_base_template",
                    "mime_type",
                    "scenarios",
                    "sender",
                    "service",
                    "squad",
                    "subject",
                    "template_id"
                  ],
                  "properties": {
                    "body": {
                      "type": "string",
                      "example": "email body as plain text"
                    },
                    "exclude_base_template": {
                      "type": "boolean",
                      "example": true
                    },
                    "mime_type": {
                      "type": "string",
                      "example": "content type of body eg: text/html"
                    },
                    "scenarios": {
                      "type": "string",
                      "example": "plain text value"
                    },
                    "sender": {
                      "type": "string",
                      "example": "Devtools@internaltools.com"
                    },
                    "service": {
                      "type": "string",
                      "example": "IDP-API"
                    },
                    "squad": {
                      "type": "string",
                      "example": "PLATFORM"
                    },
                    "subject": {
                      "type": "string",
                      "example": "plain text email subject"
                    },
                    "tags": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "example": [
                        "TAG1",
                        "TAG2"
                      ]
                    },
                    "template_id": {
                      "type": "string",
                      "example": "EMAIL_TEMPLATE_1"
                    }
                  }
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Created Email Template Id",
                "schema": {
                  "type": "object",
                  "properties": {
                    "template_id": {
                      "type": "string"
                    }
                  }
                }
              },
              "400": {
                "description": "If template_id/body/subject/squad/service/scenario/sender/mime_type/exclude_base_template is not valid",
                "schema": {
                  "type": "object",
                  "properties": {
                    "additional_data": {
                      "type": "object",
                      "additionalProperties": true
                    },
                    "error_code": {
                      "type": "string"
                    },
                    "error_message": {
                      "type": "string"
                    }
                  }
                }
              },
              "409": {
                "description": "If template_id already exists",
                "schema": {
                  "type": "object",
                  "properties": {
                    "additional_data": {
                      "type": "object",
                      "additionalProperties": true
                    },
                    "error_code": {
                      "type": "string"
                    },
                    "error_message": {
                      "type": "string"
                    }
                  }
                }
              },
              "500": {
                "description": "Internal Server Error",
                "schema": {
                  "type": "object",
                  "properties": {
                    "additional_data": {
                      "type": "object",
                      "additionalProperties": true
                    },
                    "error_code": {
                      "type": "string"
                    },
                    "error_message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ]
}

```

---

## Projects (Health Browse)

Base path: `/api/helios/v1/projects`

### 1. List All Projects

```
GET /api/helios/v1/projects
```

**Response** `200 OK`
```json
{
  "projects": [
    {
      "id": "payments",
      "display_name": "Payments Platform",
      "repositories_count": 3,
      "open_prs_count": 12,
      "open_issues_count": 8,
      "stale_branches_count": 5,
      "languages": ["Java", "Python", "Go"]
    }
  ]
}
```

### 2. Get Project Detail

```
GET /api/helios/v1/projects/:projectId
```

**Response** `200 OK`
```json
{
  "id": "payments",
  "display_name": "Payments Platform",
  "repositories": [
    {
      "id": "payments-api",
      "display_name": "Payments API",
      "default_branch": "main",
      "total_branches": 18,
      "stale_branches_count": 3,
      "open_prs_count": 5,
      "open_issues_count": 2,
      "languages": ["Java", "Go"],
      "pipelines_count": 2,
      "large_files_count": 4
    }
  ]
}
```

### 3. Get Repository Health Detail

```
GET /api/helios/v1/projects/:projectId/repositories/:repositoryId
```

**Response** `200 OK`
```json
{
  "id": "payments-api",
  "display_name": "Payments API",
  "default_branch": "main",
  "total_branches": 3,
  "size_in_bytes": 250000000,
  "count_of_files": 350,
  "branches": [
    {
      "name": "feature/old-checkout",
      "last_commit_timestamp": 1682345600
    },
    {
      "name": "hotfix/legacy-tax",
      "last_commit_timestamp": 1682345600
    },
    {
      "name": "experiment/v2-flow",
      "last_commit_timestamp": 1682345600
    }
  ],
  "open_prs_count": 5,
  "open_issues_count": 2,
  "languages_stats": {
    "Java": 200,
    "Go": 150
  },
  "pipelines": [
    {
      "name": "build-and-test",
      "link": "https://ci.example.com/payments-api/build-and-test"
    },
    {
      "name": "deploy-staging",
      "link": "https://ci.example.com/payments-api/deploy-staging"
    }
  ],
  "size_groups": {
    "above_500kb": 12,
    "above_1mb": 6,
    "above_5mb": 2
  }
}
```

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "query is required"
  }
}
```

| Status | Code | When |
|--------|------|------|
| 400 | `invalid_request` | Missing or malformed fields |
| 404 | `not_found` | Project or repository not found |
| 500 | `internal_error` | Unexpected server failure |
