import { http, HttpResponse } from "msw"

export const authHandlers = [
  http.post("/api/helios/v1/token/exchange", () => {
    return HttpResponse.json({
      access_token: "mock-token-" + Date.now(),
      token_type: "Bearer",
      expires_in: 3600,
      scope: "offline_access openid",
    })
  }),

  http.get("/api/helios/v1/user/info", () => {
    return HttpResponse.json({
      email: "jane.doe@helios.ai",
      firstName: "Jane",
      lastName: "Doe",
      display_name: "Jane Doe",
    })
  }),
]
