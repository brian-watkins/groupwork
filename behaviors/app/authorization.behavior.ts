import {
  behavior,
  example,
  effect,
  fact,
  step,
  use,
  Context,
} from "best-behavior"
import { testableApp, TestApp } from "./helpers/testableApp"
import { expect, is } from "great-expectations"
import { altAuthenticatedTeacher } from "./helpers/testTeacher"
import { testCourse } from "../domain/helpers/testCourse"

const testableAuthContext: Context<TestApp> = use(testableApp, {
  init(initialValue) {
    return initialValue
  },
  async teardown(context) {
    // We should always leave with the normal teacher authenticated
    await context.signOutCurrentTeacher()
    await context.signInAuthenticatedTeacher()
  },
})

export default behavior("groups page", [
  example(testableAuthContext)
    .description("attempt to navigate to a non-existent course")
    .script({
      suppose: [
        fact("there is a course for another teacher", async (context) => {
          await context
            .withCourses(altAuthenticatedTeacher(), [
              testCourse(1),
              testCourse(2),
            ])
            .setupDB()
        }),
      ],
      observe: [
        effect(
          "attempt to load course by another teacher results in a 404",
          async (context) => {
            const response = await context.loadGroupsForCourse(testCourse(2))
            expect(response!.status(), is(404))
          },
        ),
      ],
    })
    .andThen({
      perform: [
        step("the authenticated teacher signs out", async (context) => {
          await context.signOutCurrentTeacher()
        }),
        step("a different teacher signs in", async (context) => {
          await context.signInAltTeacher()
        }),
      ],
      observe: [
        effect(
          "the other teacher can view the groups page",
          async (context) => {
            const response = await context.loadGroupsForCourse(testCourse(2))
            expect(response!.status(), is(200))
          },
        ),
      ],
    }),
])
