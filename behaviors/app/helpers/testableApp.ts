import { Course } from "@/domain/course"
import { prisma } from "@/lib/prisma"
import { Context, useWithContext } from "best-behavior"
import { browserContext, BrowserTestInstrument } from "best-behavior/browser"
import { Page } from "playwright"
import { DisplayElement, DisplayElementList, TestDisplay } from "../../helpers/displays/display"
import { GroupSetFormElement } from "../../helpers/displays/groupSetFormDisplay"
import { GroupSetDisplayElement } from "../../helpers/displays/groupSetDisplayElement"
import { CourseFormDisplay } from "../../helpers/displays/courseFormDisplay"
import { Teacher } from "@/domain/teacher"

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

  async seedCourses(courseSets: Array<CourseSet>) {
    for (const courseSet of courseSets) {
      for (const course of courseSet.courses) {
        await prisma.course.create({
          data: {
            name: course.name,
            teacherId: courseSet.teacher.id,
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

interface CourseSet {
  teacher: Teacher
  courses: Array<Course>
}

class TestApp {
  private courseSets: Array<CourseSet> = []

  constructor(private server: AppServer, private browser: BrowserTestInstrument) { }

  withCourses(teacher: Teacher, courses: Array<Course>): TestApp {
    this.courseSets.push({
      teacher, courses
    })

    return this
  }

  async load(path = "/") {
    await this.setupDB()
    return await this.page.goto(path)
  }

  async loadCourses() {
    return await this.load("/courses")
  }

  private async setupDB(): Promise<void> {
    await this.server.resetDB()

    if (this.courseSets.length > 0) {
      await this.server.seedCourses(this.courseSets)
    }
  }

  async loadCourseGroups(index: number) {
    await this.loadCourses()
    await this.display.navigateToCourseGroups(index)
  }

  get page(): Page {
    return this.browser.page
  }

  get display(): MainDisplay {
    return new MainDisplay(this.page, { timeout: 2000 })
  }

  get courseFormDisplay(): CourseFormDisplay {
    return new CourseFormDisplay(this.page, { timeout: 2000 })
  }

  get courseGroupsDisplay(): CourseGroupsPageDisplay {
    return new CourseGroupsPageDisplay(this.page, { timeout: 2000 })
  }

  waitForCoursesPage(): Promise<void> {
    return this.page.waitForURL(`**/courses`)
  }

  async waitForCreateCoursePage(): Promise<void> {
    await this.page.waitForURL('**/courses/create')
  }

  async waitForEditCoursePage(): Promise<void> {
    await this.page.waitForURL('**/courses/*/edit')
  }
}

class MainDisplay extends TestDisplay {
  async navigateToCourseGroups(index: number): Promise<void> {
    await this.course(index).name.click()
    await this.page.waitForURL('**\/courses\/*\/groups')
  }

  get createCourseButton(): DisplayElement {
    return this.select("[data-create-course-button]")
  }

  get courseNames(): DisplayElementList {
    return this.selectAll("[data-course-name]")
  }

  course(index: number): CourseElement {
    return new CourseElement(this.page.locator("[data-course]").nth(index), this.options)
  }

  get deleteCourseConfirmationModal(): DeleteCourseConfirmationElement {
    return new DeleteCourseConfirmationElement(this.page.locator("[data-testid='delete-course-confirmation']"), this.options)
  }
}

class DeleteCourseConfirmationElement extends DisplayElement {
  get message(): DisplayElement {
    return this.selectDescendant("[data-confirmation-message]")
  }

  get cancelButton(): DisplayElement {
    return this.selectDescendant("[data-cancel]")
  }

  get deleteButton(): DisplayElement {
    return this.selectDescendant("[data-delete]")
  }
}

class DeleteGroupSetConfirmationElement extends DisplayElement {
  get message(): DisplayElement {
    return this.selectDescendant("[data-confirmation-message]")
  }

  get cancelButton(): DisplayElement {
    return this.selectDescendant("[data-cancel]")
  }

  get deleteButton(): DisplayElement {
    return this.selectDescendant("[data-delete]")
  }
}

class CourseElement extends DisplayElement {
  get editButton(): DisplayElement {
    return this.selectDescendant("[data-edit-course-button]")
  }

  get deleteButton(): DisplayElement {
    return this.selectDescendant("[data-delete-course-button]")
  }

  get name(): DisplayElement {
    return this.selectDescendant("[data-course-name]")
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

  get deleteGroupSetConfirmationModal(): DeleteGroupSetConfirmationElement {
    return new DeleteGroupSetConfirmationElement(this.page.locator("[data-testid='delete-group-set-confirmation']"), this.options)
  }

  groupSet(index: number): GroupSetDisplayElement {
    return new GroupSetDisplayElement(this.page.locator("[data-group-set]").nth(index), this.options)
  }
}