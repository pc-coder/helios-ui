import type { Plugin } from "vite"

export function mockSSOPlugin(): Plugin {
  return {
    name: "mock-sso",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/sso/authorize")) return next()

        const url = new URL(req.url, `http://${req.headers.host}`)
        const redirectUri = url.searchParams.get("redirect_uri")

        if (!redirectUri) {
          res.statusCode = 400
          res.end("Missing redirect_uri")
          return
        }

        const callbackUrl = new URL(redirectUri)
        callbackUrl.searchParams.set("access_token", "mock-token-" + Date.now())
        callbackUrl.searchParams.set("name", "Jane Doe")
        callbackUrl.searchParams.set("email", "jane.doe@helios.ai")

        res.statusCode = 302
        res.setHeader("Location", callbackUrl.toString())
        res.end()
      })
    },
  }
}
