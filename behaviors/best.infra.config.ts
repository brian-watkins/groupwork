import { defineConfig } from "best-behavior/run"
import { databaseContext } from "./infra/helpers/dbContext"
import defaultConfig from "../best.config"

export default defineConfig({
  ...defaultConfig,
  behaviorGlobs: [
    "./behaviors/infra/**/*.behavior.ts"
  ],
  context: databaseContext()
})