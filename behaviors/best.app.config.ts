import { consoleLogger, defineConfig } from "best-behavior/run"
import defaultConfig from "../best.config"
import { appContext } from "./helpers/appContext"

export default defineConfig({
  ...defaultConfig,
  behaviorGlobs: ["./behaviors/app/**/*.behavior.ts"],
  browserContext: async (browser) => {
    return browser.newContext({
      baseURL: "http://localhost:3000",
      storageState: "./behaviors/.browserStorageState/state.json",
    })
  },
  context: appContext(),
  logger: consoleLogger({
    ignore: [
      /Fast Refresh/,
      /React DevTools/,
      /Clerk has been loaded with development keys/,
      /Vercel Speed Insights/,
      /Failed to load resource/,
    ],
  }),
})
