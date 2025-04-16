import { defineConfig } from "best-behavior/run"
import appConfig from "./best.app.config"
import { appContext } from "./helpers/appContext"
import { MonocartCoverageReporter } from "best-behavior/coverage"
import { ServerCoverageProvider } from "./helpers/serverCoverageProvider"


export default defineConfig({
  ...appConfig,
  context: appContext({ withCoverage: true }),
  collectCoverage: true,
  coverageProvider: new ServerCoverageProvider({ cdpPort: 9230 }),
  coverageReporter: new MonocartCoverageReporter({
    reports: [
      "raw"
    ],

    outputDir: "./coverage-reports/app",
    
    entryFilter: (entry) => {
      if (entry.source?.includes("sourceMappingURL") === false) {
        return false
      }
  
      if (entry.source?.includes("rsc://React/Client")) {
        return false
      }

      if (entry.url.includes("node_modules")) {
        return false
      }

      if (entry.url.includes("next/static/")) {
        return true
      }
  
      if (entry.url.includes("next/server/edge")) {
        return false
      }

      if (
        entry.url.includes("next/server/") &&
        // without this line coverage for server actions is not detected correctly
        entry.url.startsWith("file:") &&
        // ssr version of client component, including these messes up line coverage of client components
        !entry.functions?.some((f) => f.functionName.includes("[app-ssr]"))
      ) {
        return true
      }
  
      return false
    },
  
    sourceFilter: (sourcePath) => {
      return (
        !sourcePath.includes("node_modules/") &&
        !sourcePath.startsWith("[turbopack]") &&
        !sourcePath.startsWith("[project]") &&
        !sourcePath.startsWith(".next/server") &&
        !sourcePath.startsWith(".next-internal/server") &&
        !sourcePath.endsWith(".tsx/proxy.mjs")
      )
    }
  })
})