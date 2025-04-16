import {
  CoverageContext,
  CoverageProvider,
  V8CoverageData,
} from "best-behavior/coverage"
import { CDPClient } from "monocart-coverage-reports"
import { fileURLToPath } from "node:url"
import fs from "node:fs"
import path from "node:path"

export interface ServerCoverageProviderOptions {
  cdpPort: number
}

export class ServerCoverageProvider implements CoverageProvider {
  private coverageContext: CoverageContext | undefined

  constructor(private options: ServerCoverageProviderOptions) {}

  async prepareForCoverage(context: CoverageContext): Promise<void> {
    this.coverageContext = context
  }

  async finishCoverage(): Promise<void> {
    const client = await CDPClient({
      port: this.options.cdpPort,
    })

    if (client === undefined) {
      console.log("CDPClient is undefined!?!?")
      return
    }

    const dir = await client.writeCoverage()
    await client.close()

    if (!fs.existsSync(dir)) {
      console.log("No coverage dir!??!!", dir)
      return
    }

    const files = fs.readdirSync(dir)
    for (const filename of files) {
      const content = fs
        .readFileSync(path.resolve(dir, filename))
        .toString("utf-8")
      const json = JSON.parse(content)
      let coverageList: Array<V8CoverageData> = json.result

      coverageList = coverageList
        .filter((entry) => entry.url && entry.url.startsWith("file:"))
        .filter((entry) => !entry.url.includes("node_modules"))
        .filter((entry) => !entry.url.includes(".volta"))

      if (coverageList.length === 0) {
        continue
      }

      coverageList.forEach((entry) => {
        const filePath = fileURLToPath(entry.url)
        if (fs.existsSync(filePath)) {
          entry.source = fs.readFileSync(filePath).toString("utf8")
        }
      })

      await this.coverageContext?.recordData(coverageList)
    }
  }
}
