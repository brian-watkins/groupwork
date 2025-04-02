import { behavior, example, fact, effect, step } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { expect, resolvesTo, stringContaining, arrayWith, is, arrayWithLength } from "great-expectations";
import { testStudent } from "../domain/helpers/testStudent";
import { testCourse } from "../domain/helpers/testCourse";
import { studentName } from "./helpers/matchers";

export default behavior("courses page", [

  example(testableApp)
    .description("show a list of courses")
    .script({
      suppose: [
        fact("the app is loaded", async (context) => {
          await context
            .withCourses([
              testCourse(1).withStudents([
                testStudent(1),
                testStudent(2),
                testStudent(3),
              ]),
              testCourse(2).withStudents([
                testStudent(4),
                testStudent(5),
              ])
            ])
            .load()
        })
      ],
      observe: [
        effect("the page title is displayed", async (context) => {
          await expect(context.display.select("h1").text(),
            resolvesTo(stringContaining("Welcome"))
          )
        }),
        effect("course list is displayed", async (context) => {
          await expect(context.display.courses.texts(), resolvesTo([
            testCourse(1).name,
            testCourse(2).name
          ]))
        })
      ]
    }),

  example(testableApp)
    .description("record a new group set")
    .script({
      suppose: [
        fact("the app is loaded with a course that has students", async (context) => {
          await context
            .withCourses([
              testCourse(1).withStudents([
                testStudent(1),
                testStudent(2),
                testStudent(3),
                testStudent(4),
              ])
            ])
            .loadCourseGroups(0)
        })
      ],
      perform: [
        step("create some groups", async (context) => {
          await context.courseGroupsDisplay.assignGroupsButton.click()
          await context.courseGroupsDisplay.groupSetForm.waitForGroups(2)
        }),
        step("name the group set", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type("Test Group Set")
        }),
        step("click the 'Record Groups' button", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()

          // Wait for the success message to appear
          await context.courseGroupsDisplay.recordSuccessMessage.waitForVisible()
        })
      ],
      observe: [
        effect("the new group set appears in the list with the provided name", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).name.text(), resolvesTo(
            "Test Group Set"
          ))
        })
      ]
    }).andThen({
      perform: [
        step("open the recorded group set", async (context) => {
          await context.courseGroupsDisplay.groupSet(0).click()
        })
      ],
      observe: [
        effect("the saved groups are displayed", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).groups.count(), resolvesTo(2))
          const group1Members = await context.courseGroupsDisplay.groupSet(0).group(0).members.texts()
          expect(group1Members, is(arrayWithLength(2)))

          const group2Members = await context.courseGroupsDisplay.groupSet(0).group(1).members.texts()
          expect(group2Members, is(arrayWithLength(2)))

          expect(group1Members.concat(group2Members), is(arrayWith([
            studentName(testStudent(1)),
            studentName(testStudent(2)),
            studentName(testStudent(3)),
            studentName(testStudent(4))
          ], { withAnyOrder: true })))
        })
      ]
    })

])