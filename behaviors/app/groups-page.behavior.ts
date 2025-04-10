import { behavior, example, fact, effect, step } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { arrayWith, expect, is, resolvesTo } from "great-expectations";
import { testCourse } from "../domain/helpers/testCourse";
import { testStudent, testStudents } from "../domain/helpers/testStudent";
import { studentName } from "./helpers/matchers";
import { authenticatedTeacher } from "./helpers/testTeacher";

export default behavior("course students page", [

  example(testableApp)
    .description("navigate to a course and view its groups")
    .script({
      suppose: [
        fact("the app is loaded with courses", async (context) => {
          await context
            .withCourses(authenticatedTeacher(), [
              testCourse(1).withStudents(testStudents(3))
            ])
            .loadCourses()
        })
      ],
      perform: [
        step("click on a course", async (context) => {
          await context.display.navigateToCourseGroups(0)
        })
      ],
      observe: [
        effect("the page displays the course name", async (context) => {
          const headerText = await context.display.select("h1").text()
          expect(headerText, is(testCourse(1).name))
        }),
        effect("the form is not initially visible", async (context) => {
          await expect(context.courseGroupsDisplay.groupSetForm.isHidden(), resolvesTo(true))
        })
      ]
    }).andThen({
      perform: [
        step("click the 'Create New Groups' button", async (context) => {
          await context.courseGroupsDisplay.createNewGroupsButton.click()
        })
      ],
      observe: [
        effect("the form is displayed", async (context) => {
          await expect(context.courseGroupsDisplay.groupSetForm.isVisible(), resolvesTo(true))
        }),
        effect("the form shows a group with all the students", async (context) => {
          await expect(context.courseGroupsDisplay.groupSetForm.groups.count(), resolvesTo(1))

          await expect(context.courseGroupsDisplay.groupSetForm.group(0).members.texts(), resolvesTo(arrayWith([
            studentName(testStudent(1)),
            studentName(testStudent(2)),
            studentName(testStudent(3))
          ], { withAnyOrder: true })))
        })
      ]
    }).andThen({
      perform: [
        step("click the 'Cancel' button", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.cancelButton.click()
        })
      ],
      observe: [
        effect("the form is hidden", async (context) => {
          await expect(context.courseGroupsDisplay.groupSetForm.isHidden(), resolvesTo(true))
        })
      ]
    }),

  example(testableApp)
    .description("navigate to groups for a course with no students")
    .script({
      suppose: [
        fact("the app is loaded with a course that has no students", async (context) => {
          await context
            .withCourses(authenticatedTeacher(), [
              testCourse(1).withStudents([])
            ])
            .loadCourses()
        })
      ],
      perform: [
        step("click on a course", async (context) => {
          await context.display.navigateToCourseGroups(0)
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