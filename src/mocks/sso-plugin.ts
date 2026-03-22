import type { Plugin } from "vite"

export function mockSSOPlugin(): Plugin {
  return {
    name: "mock-sso",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/sso/authorize")) return next()

        const url = new URL(req.url, `http://${req.headers.host}`)
        const redirectUri = url.searchParams.get("redirect_uri")
        const state = url.searchParams.get("state")

        if (!redirectUri) {
          res.statusCode = 400
          res.end("Missing redirect_uri")
          return
        }

        const callbackUrl = new URL(redirectUri)
        callbackUrl.searchParams.set("code", "mock-code-" + Date.now())
        if (state) callbackUrl.searchParams.set("state", state)

        res.statusCode = 302
        res.setHeader("Location", callbackUrl.toString())
        res.end()
      })
    },
  }
}
