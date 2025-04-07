import { clerk, clerkSetup } from "@clerk/testing/playwright"
import { Context } from "best-behavior"
import { loadEnvFile } from "node:process"
import fs from "node:fs/promises"
import { chromium } from "playwright"

export interface ClerkContextOptions {
  envFile: string
  storageStateFile: string
  refreshTimeMillis: number
}

export function clerkAuthContext(options: ClerkContextOptions): Context<void> {
  loadEnvFile(options.envFile)
  
  return {
    init: async () => {
      const timeSinceLastRefresh = await millisSinceLastRefresh(options)
      if (timeSinceLastRefresh < options.refreshTimeMillis) {
        console.log("Skipping Clerk auth because within refresh time.\n")
        return
      }

      console.log("Initializing Clerk auth for test user", process.env.E2E_CLERK_USER_USERNAME)
      console.log()

      const browser = await chromium.launch({ headless: true })
      const page = await browser.newPage({
        baseURL: "http://localhost:3000"
      })

      await clerkSetup()

      await page.goto('/')

      await clerk.signIn({
        page,
        signInParams: {
          strategy: 'password',
          identifier: process.env.E2E_CLERK_USER_USERNAME!,
          password: process.env.E2E_CLERK_USER_PASSWORD!,
        },
      })

      await page.context().storageState({ path: options.storageStateFile })

      await page.close()
      await browser.close()
    }
  }
}

async function millisSinceLastRefresh(options: ClerkContextOptions): Promise<number> {
  const stats = await fs.stat(options.storageStateFile)
  return Date.now() - stats.mtime.getTime()
}