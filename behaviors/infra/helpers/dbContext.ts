import { PrismaClient } from "@prisma/generated-client"
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"
import { Context, globalContext, use } from "best-behavior"
import { execSync } from "node:child_process"

export function databaseContext(): Context<TestPostgresDB> {
  return {
    init: async () => {
      const container = new TestPostgresDB()
      await container.start()
      return container
    },
    teardown: (container) => {
      return container.stop()
    },
  }
}

export function useDatabase<T>(
  context: Context<T, TestPostgresDB>,
): Context<T> {
  return use(globalContext<TestPostgresDB>(), context)
}

export class TestPostgresDB {
  private container: StartedPostgreSqlContainer | undefined
  private client: PrismaClient | undefined

  async start(): Promise<void> {
    this.container = await new PostgreSqlContainer("postgres:17.2-alpine")
      // .withLogConsumer((stream) => {
      // stream.on("data", (data) => {
      // process.stdout.write(`[TestContainer] ${data.toString()}`)
      // })
      // })
      .start()

    execSync("node_modules/.bin/prisma migrate reset --force --skip-seed", {
      env: {
        ...process.env,
        DATABASE_URL: this.container.getConnectionUri(),
      },
    })
  }

  getConnectionUri(): string | undefined {
    return this.container?.getConnectionUri()
  }

  get prisma(): PrismaClient {
    if (this.client === undefined) {
      this.client = new PrismaClient({
        datasourceUrl: this.getConnectionUri(),
      })
    }
    return this.client
  }

  async stop(): Promise<void> {
    await this.container?.stop()
  }
}
