import { defineConfig } from "best-behavior/run"
import { firefox } from "playwright"

export default defineConfig({
  browser: (showBrowser) => {
    return firefox.launch({
      headless: !showBrowser
    })
  },
  viteConfig: "./behaviors/vite.config.ts",
  failFast: true
})