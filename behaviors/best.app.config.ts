import { defineConfig } from "best-behavior/run"
import { clerkAuthContext } from "./helpers/clerkAuthContext"
import defaultConfig from "../best.config"

export default defineConfig({
  ...defaultConfig,
  behaviorGlobs: [
    "./behaviors/app/**/*.behavior.ts"
  ],
  browserContext: async (browser, localServerURL) => {
    return browser.newContext({
      baseURL: "http://localhost:3000",
      storageState: "./behaviors/.browserStorageState/state.json"
    })
  },
  context: clerkAuthContext({
    storageStateFile: "./behaviors/.browserStorageState/state.json",
    refreshTimeMillis: 3 * 24 * 60 * 60 * 1000
  })
})