import { consoleLogger, defineConfig } from "best-behavior/run"
import defaultConfig from "../best.config"

export default defineConfig({
  ...defaultConfig,
  behaviorGlobs: [
    "./behaviors/component/**/*.behavior.ts"
  ],
  logger: consoleLogger({
    ignore: [
      /React DevTools/,
    ]
  })
})