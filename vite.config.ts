import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { mockSSOPlugin } from "./src/mocks/sso-plugin"

const useProxy = !!process.env.VITE_USE_PROXY

// https://vite.dev/config/
export default defineConfig({
  base: "/helios/",
  plugins: [react(), tailwindcss(), ...(!useProxy ? [mockSSOPlugin()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: useProxy
    ? {
        proxy: {
          "/api/helios": {
            target: "http://localhost:8090",
            changeOrigin: true,
          },
        },
      }
    : undefined,
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
