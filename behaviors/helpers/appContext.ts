import { Context, contextMap } from "best-behavior";
import { databaseContext, TestPostgresDB } from "../infra/helpers/dbContext";
import { serverContext } from "best-behavior/server";
import { clerkAuthContext } from "./clerkAuthContext";
import { consoleLogger, LogLevel } from "best-behavior/run";
import fs from "node:fs/promises"
import path from "node:path"

export type AppContextType = { database: TestPostgresDB }

export interface AppContextOptions {
  withCoverage?: boolean
}

export function appContext(options: AppContextOptions = {}) {
  const base: Record<string, Context<any>> = {
    database: databaseContext()
  }

  if (options.withCoverage) {
    base.coverageDir = tempDirContext(".v8-coverage")
  }
  
  return contextMap(base)
    .set("server", ({ database }) => {
      const env: Record<string, string> = {
        DATABASE_URL: database.getConnectionUri()!
      }

      if (options.withCoverage === true) {
        env.NODE_V8_COVERAGE = ".v8-coverage"
        env.NODE_OPTIONS = "--inspect=9229"
      }

      return serverContext({
        command: "npm run local:test:app",
        resource: "http://localhost:3000",
        env,
        logger: consoleLogger({ level: LogLevel.Error })
      })
    })
    .set("auth", () => clerkAuthContext({
      storageStateFile: "./behaviors/.browserStorageState/state.json",
      refreshTimeMillis: 3 * 24 * 60 * 60 * 1000
    }))
}

function tempDirContext(relativePath: string): Context<string> {
  const absolutePath = path.resolve(".", relativePath)
  
  return {
    init: async () => {
      await fs.mkdir(absolutePath, { recursive: true })
      return absolutePath
    },
    teardown: async () => {
      await fs.rm(absolutePath, { recursive: true })
    }
  }
}