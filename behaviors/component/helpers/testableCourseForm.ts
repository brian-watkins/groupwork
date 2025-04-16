import { Context, use } from "best-behavior"
import { browserContext, BrowserTestInstrument } from "best-behavior/browser"
import { CourseFormDisplay } from "../../helpers/displays/courseFormDisplay"

export const testableCourseForm: Context<TestableCourseForm> = use(
  browserContext(),
  {
    init(browser) {
      return new TestableCourseForm(browser)
    },
  },
)

export interface CreateCourseDetails {
  name: string
  students: Array<string>
}

class TestableCourseForm {
  constructor(private browser: BrowserTestInstrument) {}

  async render(): Promise<void> {
    await this.browser.page.evaluate(async () => {
      const { render } = await import("./render/courseForm/render")
      render()
    })
  }

  async getCreateCourseDetails(): Promise<CreateCourseDetails | undefined> {
    return this.browser.page.evaluate(() => window.createCourseDetails)
  }

  async getReturnToMainCalls(): Promise<number> {
    return this.browser.page.evaluate(() => window.shouldReturnToMainCalls)
  }

  get display(): CourseFormDisplay {
    return new CourseFormDisplay(this.browser.page, { timeout: 200 })
  }
}
