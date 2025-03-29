import { Context, useWithContext } from "best-behavior"
import { browserContext, BrowserTestInstrument } from "best-behavior/browser"
import { Page } from "playwright"

function serverContext(): Context<AppServer> {
  return {
    init: async () => {
      const server = new AppServer()
      await server.start()
      return server
    },
    teardown(context) {
      console.log("Teardown server")
    },
  }
}

class AppServer {
  private host = "http://localhost:3000"

  async start() {
    console.log("starting next.js")
  }

  urlForPath(path: string): string {
    return `${this.host}${path}`
  }
}

const useServer = useWithContext({
  server: serverContext(),
  browser: browserContext()
})

export const testableApp: Context<TestApp> = useServer({
  init({server, browser}) {
    return new TestApp(server, browser)
  },
})

class TestApp {
  constructor(private server: AppServer, private browser: BrowserTestInstrument) { }

  async loadApp() {
    await this.browser.page.goto(this.server.urlForPath("/"))
  }

  get page(): Page {
    return this.browser.page
  }
}