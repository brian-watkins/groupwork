import { defineConfig } from "best-behavior/run"
import { databaseContext } from "./infra/helpers/dbContext"
import defaultConfig from "../best.config"
import { MonocartCoverageReporter } from "best-behavior/coverage"

export default defineConfig({
  ...defaultConfig,
  behaviorGlobs: ["./behaviors/infra/**/*.behavior.ts"],
  context: databaseContext(),
  coverageReporter: new MonocartCoverageReporter({
    reports: ["raw"],
    outputDir: "./coverage-reports/infra",
    entryFilter: {
      "/src": true,
    },
  }),
})
