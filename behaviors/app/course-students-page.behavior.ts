import { behavior, example, fact, effect, step } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { arrayWith, equalTo, expect, is, resolvesTo, stringContaining } from "great-expectations";
import { testCourse } from "../domain/helpers/testCourse";
import { testStudent, testStudents } from "../domain/helpers/testStudent";

export default behavior("course students page", [

  example(testableApp)
    .description("navigate to a course and view its students")
    .script({
      suppose: [
        fact("the app is loaded with courses", async (context) => {
          await context
            .withCourses([
              testCourse(1).withStudents(testStudents(3))
            ])
            .load()
        })
      ],
      perform: [
        step("click on a course", async (context) => {
          await context.page.locator("[data-course-details]").nth(0).click()
          await context.page.waitForURL('**\/courses/*')
        })
      ],
      observe: [
        effect("the page displays the course name", async (context) => {
          const headerText = await context.page.locator("h1").innerText({ timeout: 5000 })
          expect(headerText, is(testCourse(1).name))
        }),
        effect("the page shows a group with all the students", async (context) => {
          await expect(context.page.locator("[data-student-group]").count(), resolvesTo(1))

          const students = await context.page.locator("[data-student-name]").allInnerTexts()
          expect(students, is(arrayWith([
            equalTo(testStudent(1).name),
            equalTo(testStudent(2).name),
            equalTo(testStudent(3).name),
          ], { withAnyOrder: true })))
        })
      ]
    }),

  example(testableApp)
    .description("navigate to a course with no students")
    .script({
      suppose: [
        fact("the app is loaded with a course that has no students", async (context) => {
          await context
            .withCourses([
              testCourse(1).withStudents([])
            ])
            .load()
        })
      ],
      perform: [
        step("click on a course", async (context) => {
          await context.page.locator("[data-course-details]").nth(0).click()
          await context.page.waitForURL('**\/courses/*')
        })
      ],
      observe: [
        effect("the page displays the course name", async (context) => {
          const headerText = await context.page.locator("h1").innerText({ timeout: 5000 })
          expect(headerText, is(testCourse(1).name))
        }),
        effect("the page shows a message about no students", async (context) => {
          await expect(context.page.locator('[data-no-students]').isVisible({ timeout: 1000 }),
            resolvesTo(true)
          )
        })
      ]
    }),

  example(testableApp)
    .description("attempt to navigate to a non-existent course")
    .script({
      observe: [
        effect("navigating to an unknown page results in a 404", async (context) => {
          const response = await context.load('/courses/non-existent-id')
          expect(response!.status(), is(404))
        })
      ]
    })

])