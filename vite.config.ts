import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { mockSSOPlugin } from "./src/mocks/sso-plugin"

// https://vite.dev/config/
export default defineConfig({
  base: "/helios/",
  plugins: [react(), tailwindcss(), mockSSOPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
