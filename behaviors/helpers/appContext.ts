import { contextMap } from "best-behavior";
import { databaseContext, TestPostgresDB } from "../infra/helpers/dbContext";
import { serverContext } from "best-behavior/server";
import { clerkAuthContext } from "./clerkAuthContext";
import { consoleLogger, LogLevel } from "best-behavior/run";

export type AppContextType = { database: TestPostgresDB }

export const appContext = contextMap({ database: databaseContext() })
  .set("server", ({ database }) => serverContext({
    command: "npm run local:test:app",
    resource: "http://localhost:3000",
    env: {
      DATABASE_URL: database.getConnectionUri()!
    },
    logger: consoleLogger({ level: LogLevel.Error })
  }))
  .set("auth", () => clerkAuthContext({
    storageStateFile: "./behaviors/.browserStorageState/state.json",
    refreshTimeMillis: 3 * 24 * 60 * 60 * 1000
  }))