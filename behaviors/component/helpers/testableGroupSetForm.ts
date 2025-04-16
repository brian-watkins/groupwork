import { Group } from "@/domain/group"
import { Context, use } from "best-behavior"
import { browserContext, BrowserTestInstrument } from "best-behavior/browser"
import { GroupSetFormElement } from "../../helpers/displays/groupSetFormDisplay"
import { Student } from "@/domain/student"
import { testCourse } from "../../domain/helpers/testCourse"

export const testableGroupSetForm: Context<TestableGroupSetForm> = use(
  browserContext(),
  {
    init(browser) {
      return new TestableGroupSetForm(browser)
    },
  },
)

class TestableGroupSetForm {
  private groups: Array<Group> = []
  private students: Array<Student> = []

  constructor(private browser: BrowserTestInstrument) {}

  withStudents(students: Array<Student>) {
    this.students = students
    return this
  }

  withGroups(groups: Array<Group>) {
    this.groups = groups
    return this
  }

  async render(): Promise<void> {
    await this.browser.page.evaluate(
      async (data) => {
        function deserializeTestGroup(data: any): Group {
          return {
            members: new Set(data.members),
          }
        }

        const { render } = await import("./render/groups/renderGroupSetForm")

        render(data.course, data.groups.map(deserializeTestGroup))
      },
      {
        course: testCourse(1).withStudents(this.students),
        groups: this.groups.map(serializeTestGroup),
      },
    )
  }

  async completeRecordGroupSetsAction(): Promise<void> {
    return this.browser.page.evaluate(() => {
      window.resolveRecordGroups()
    })
  }

  async calledRecordGroups(): Promise<boolean> {
    return this.browser.page.evaluate(() => {
      return window.calledRecordGroups > 0
    })
  }

  get display(): GroupSetFormElement {
    return new GroupSetFormElement(
      this.browser.page.locator("[data-group-set-form]"),
      { timeout: 200 },
    )
  }
}

export function serializeTestGroup(group: Group): any {
  return {
    members: Array.from(group.members),
  }
}
