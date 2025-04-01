import { behavior, example, fact, effect, step } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { arrayWith, expect, is, resolvesTo } from "great-expectations";
import { testCourse } from "../domain/helpers/testCourse";
import { testStudent, testStudents } from "../domain/helpers/testStudent";
import { studentName } from "./helpers/matchers";

export default behavior("course students page", [

  example(testableApp)
    .description("navigate to a course and view its groups")
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
          await context.display.navigateToCourse(0)
        })
      ],
      observe: [
        effect("the page displays the course name", async (context) => {
          const headerText = await context.display.select("h1").text()
          expect(headerText, is(testCourse(1).name))
        }),
        effect("the page shows a group with all the students", async (context) => {
          await expect(context.courseGroupsDisplay.groups.count(), resolvesTo(1))

          await expect(context.courseGroupsDisplay.group(0).members.texts(), resolvesTo(arrayWith([
            studentName(testStudent(1)),
            studentName(testStudent(2)),
            studentName(testStudent(3))
          ], { withAnyOrder: true })))
        })
      ]
    }),

  example(testableApp)
    .description("navigate to groups for a course with no students")
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
          await context.display.navigateToCourse(0)
        })
      ],
      observe: [
        effect("the page displays the course name", async (context) => {
          const headerText = await context.display.select("h1").text()
          expect(headerText, is(testCourse(1).name))
        }),
        effect("the page shows a message about no students", async (context) => {
          await expect(context.courseGroupsDisplay.noStudents.isVisible(),
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