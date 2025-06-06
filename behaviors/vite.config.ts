import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  css: {
    postcss: {},
  },
  optimizeDeps: {
    exclude: ["@testcontainers/postgresql"],
  },
  plugins: [tsconfigPaths(), react(), tailwindcss()],
})
