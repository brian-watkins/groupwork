import { Course } from "@/domain/course"
import { prisma } from "@/lib/prisma"
import { Context, useWithContext } from "best-behavior"
import { browserContext, BrowserTestInstrument } from "best-behavior/browser"
import { Page } from "playwright"
import { DisplayElement, DisplayElementList, TestDisplay } from "../../helpers/displays/display"
import { GroupSetFormElement } from "../../helpers/displays/groupSetFormDisplay"
import { GroupSetDisplayElement } from "../../helpers/displays/groupSetDisplayElement"

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

  async resetDB(): Promise<void> {
    await prisma.course.deleteMany()
  }

  async seedCourses(courses: Array<Course>) {
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
  private courses: Array<Course> = []

  constructor(private server: AppServer, private browser: BrowserTestInstrument) { }

  withCourses(courses: Array<Course>): TestApp {
    this.courses = courses
    return this
  }

  async load(path = "/") {
    await this.server.resetDB()

    if (this.courses !== undefined) {
      await this.server.seedCourses(this.courses)
    }
    return await this.browser.page.goto(this.server.urlForPath(path))
  }

  async loadCourseGroups(index: number) {
    await this.load()
    await this.display.navigateToCourseGroups(index)
  }

  get page(): Page {
    return this.browser.page
  }

  waitForHomePage(): Promise<void> {
    const origin = new URL(this.page.url()).origin
    return this.page.waitForURL(origin)
  }

  get display(): MainDisplay {
    return new MainDisplay(this.page, { timeout: 2000 })
  }

  get createCourseDisplay(): CreateCoursePageDisplay {
    return new CreateCoursePageDisplay(this.page, { timeout: 2000 })
  }

  get courseGroupsDisplay(): CourseGroupsPageDisplay {
    return new CourseGroupsPageDisplay(this.page, { timeout: 2000 })
  }
}

class MainDisplay extends TestDisplay {
  async navigateToCourseGroups(index: number): Promise<void> {
    await this.page.locator("[data-course-details]").nth(index).click({ timeout: 3000 })
    await this.page.waitForURL('**\/courses\/*\/groups')
  }

  get createCourseButton(): DisplayElement {
    return this.select("[data-create-course-button]")
  }

  get courses(): DisplayElementList {
    return this.selectAll("[data-course-name]")
  }
}

class CreateCoursePageDisplay extends TestDisplay {
  get courseNameInput(): DisplayElement {
    return this.select("[data-course-name-input]")
  }

  get studentNameInput(): DisplayElement {
    return this.select("[data-student-name-input]")
  }

  get addStudentButton(): DisplayElement {
    return this.select("[data-add-student-button]")
  }

  get saveCourseButton(): DisplayElement {
    return this.select("[data-save-course-button]")
  }

  get cancelButton(): DisplayElement {
    return this.select("[data-cancel-button]")
  }
}

class CourseGroupsPageDisplay extends TestDisplay {
  get groupSetForm(): GroupSetFormElement {
    return new GroupSetFormElement(this.page.locator("[data-group-set-form]"), this.options)
  }

  get groupSizeInput(): DisplayElement {
    return this.select("[data-group-size-input]")
  }

  get createNewGroupsButton(): DisplayElement {
    return this.select("[data-create-new-groups-button]")
  }

  get assignGroupsButton(): DisplayElement {
    return this.select("[data-assign-groups-button]")
  }

  get recordSuccessMessage(): DisplayElement {
    return this.select(".bg-green-100.text-green-800")
  }

  get noStudents(): DisplayElement {
    return this.select("[data-no-students]")
  }

  get groupSets(): DisplayElementList {
    return this.selectAll("[data-group-set]")
  }

  groupSet(index: number): GroupSetDisplayElement {
    return new GroupSetDisplayElement(this.page.locator("[data-group-set]").nth(index), this.options)
  }
}