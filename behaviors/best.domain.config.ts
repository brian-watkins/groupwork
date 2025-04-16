import { MonocartCoverageReporter } from "best-behavior/coverage"
import { defineConfig } from "best-behavior/run"
import defaultConfig from "../best.config"

export default defineConfig({
  ...defaultConfig,
  behaviorGlobs: ["./behaviors/domain/**/*.behavior.ts"],
  coverageReporter: new MonocartCoverageReporter({
    reports: ["raw"],
    outputDir: "./coverage-reports/domain",
    entryFilter: {
      "/src": true,
    },
  }),
})
