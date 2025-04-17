import { Course, CourseId } from "@/domain/course"
import { Context, contextMap, globalContext, use } from "best-behavior"
import { browserContext, BrowserTestInstrument } from "best-behavior/browser"
import { Page } from "playwright"
import {
  DisplayElement,
  DisplayElementList,
  TestDisplay,
} from "../../helpers/displays/display"
import { GroupSetFormElement } from "../../helpers/displays/groupSetFormDisplay"
import { GroupSetDisplayElement } from "../../helpers/displays/groupSetDisplayElement"
import { CourseFormDisplay } from "../../helpers/displays/courseFormDisplay"
import { Teacher } from "@/domain/teacher"
import { AppContextType } from "../../helpers/appContext"
import { PrismaClient } from "@/lib/prisma"
import { clerk } from "@clerk/testing/playwright"

export const testableApp: Context<TestApp> = use(
  contextMap({
    global: globalContext<AppContextType>(),
    browser: browserContext(),
  }),
  {
    init({ global, browser }) {
      return new TestApp(global.database.prisma, browser)
    },
  },
)

interface CourseSet {
  teacher: Teacher
  courses: Array<Course>
}

export class TestApp {
  private courseSets: Array<CourseSet> = []
  private createdCourses: Map<CourseId, CourseId> = new Map()

  constructor(
    private prisma: PrismaClient,
    private browser: BrowserTestInstrument,
  ) {}

  withCourses(teacher: Teacher, courses: Array<Course>): TestApp {
    this.courseSets.push({
      teacher,
      courses,
    })

    return this
  }

  private async resetDB(): Promise<void> {
    await this.prisma.course.deleteMany()
  }

  private async seedCourses(courseSets: Array<CourseSet>) {
    for (const courseSet of courseSets) {
      for (const course of courseSet.courses) {
        const created = await this.prisma.course.create({
          data: {
            name: course.name,
            teacherId: courseSet.teacher.id,
            students: {
              create: course.students.map((student) => {
                return { name: student.name }
              }),
            },
          },
        })
        this.createdCourses.set(course.id, created.id)
      }
    }
  }

  async setupDB(): Promise<void> {
    await this.resetDB()

    if (this.courseSets.length > 0) {
      await this.seedCourses(this.courseSets)
    }
  }

  async load(path = "/") {
    return await this.page.goto(path)
  }

  async loadCourses() {
    return await this.load("/courses")
  }

  async loadGroupsForCourse(course: Course) {
    const courseId = this.createdCourses.get(course.id)
    return await this.load(`/courses/${courseId}/groups`)
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
    await this.page.waitForURL("**/courses/create")
  }

  async waitForEditCoursePage(): Promise<void> {
    await this.page.waitForURL("**/courses/*/edit")
  }

  async signOutCurrentTeacher(): Promise<void> {
    await clerk.signOut({
      page: this.page,
    })
  }

  async signInAuthenticatedTeacher(): Promise<void> {
    await this.signInUser({
      username: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    })
  }

  async signInAltTeacher(): Promise<void> {
    await this.signInUser({
      username: process.env.E2E_CLERK_ALT_USER_USERNAME!,
      password: process.env.E2E_CLERK_ALT_USER_PASSWORD!,
    })
  }

  private async signInUser(credentials: {
    username: string
    password: string
  }): Promise<void> {
    await this.page.goto("/")

    await clerk.signIn({
      page: this.page,
      signInParams: {
        strategy: "password",
        identifier: credentials.username,
        password: credentials.password,
      },
    })
  }
}

class MainDisplay extends TestDisplay {
  async navigateToCourses(): Promise<void> {
    // NOTE: This does not exist any more! We need some breadcrumbs ...
    // await this.selectWithText("View Courses").click()
    await this.page.goto("/courses")
  }

  async navigateToCourseGroups(index: number): Promise<void> {
    await this.course(index).name.click()
    await this.page.waitForURL("**\/courses\/*\/groups")
  }

  get createCourseButton(): DisplayElement {
    return this.select("[data-create-course-button]")
  }

  get courseNames(): DisplayElementList {
    return this.selectAll("[data-course-name]")
  }

  courseByName(name: string): CourseElement {
    return new CourseElement(
      this.page.locator(`[data-course]:has-text("${name}")`),
      this.options,
    )
  }

  course(index: number): CourseElement {
    return new CourseElement(
      this.page.locator("[data-course]").nth(index),
      this.options,
    )
  }

  get deleteCourseConfirmationModal(): DeleteCourseConfirmationElement {
    return new DeleteCourseConfirmationElement(
      this.page.locator("[data-testid='delete-course-confirmation']"),
      this.options,
    )
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
    return new GroupSetFormElement(
      this.page.locator("[data-group-set-form]"),
      this.options,
    )
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
    return new DeleteGroupSetConfirmationElement(
      this.page.locator("[data-testid='delete-group-set-confirmation']"),
      this.options,
    )
  }

  groupSet(index: number): GroupSetDisplayElement {
    return new GroupSetDisplayElement(
      this.page.locator("[data-group-set]").nth(index),
      this.options,
    )
  }
}
