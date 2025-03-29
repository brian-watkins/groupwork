import { Course } from "@/domain/course"
import { prisma } from "@/lib/prisma"
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

  async seedCourses(courses: Array<Course>) {
    await prisma.course.deleteMany({})
    for (const course of courses) {
      await prisma.course.create({
        data: {
          name: course.name,
          students: {
            create: course.students.map(student => {
              return { name: student.name }
            })
          }
        }
      })
    }
  }
}

const useServer = useWithContext({
  server: serverContext(),
  browser: browserContext()
})

export const testableApp: Context<TestApp> = useServer({
  init({ server, browser }) {
    return new TestApp(server, browser)
  },
})

class TestApp {
  private courses: Array<Course> | undefined

  constructor(private server: AppServer, private browser: BrowserTestInstrument) { }

  withCourses(courses: Array<Course>): TestApp {
    this.courses = courses
    return this
  }

  async load(path = "/") {
    if (this.courses !== undefined) {
      await this.server.seedCourses(this.courses)
    }
    return await this.browser.page.goto(this.server.urlForPath(path))
  }

  get page(): Page {
    return this.browser.page
  }
}