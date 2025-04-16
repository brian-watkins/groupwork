import { consoleLogger, defineConfig } from "best-behavior/run"
import defaultConfig from "../best.config"
import { MonocartCoverageReporter } from "best-behavior/coverage"

export default defineConfig({
  ...defaultConfig,
  behaviorGlobs: ["./behaviors/component/**/*.behavior.ts"],
  logger: consoleLogger({
    ignore: [/React DevTools/],
  }),
  coverageReporter: new MonocartCoverageReporter({
    reports: ["raw"],
    outputDir: "./coverage-reports/component",
    entryFilter: {
      node_modules: false,
      "globals.css": false,
      "/src": true,
    },
    sourcePath(filePath, info) {
      if (info.distFile) {
        return info.distFile.substring(15)
      } else {
        return filePath
      }
    },
  }),
})
