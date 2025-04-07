import { behavior, example, fact, step, effect } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { expect, resolvesTo, stringContaining, arrayWith, equalTo } from "great-expectations";

export default behavior("create course page", [

  example(testableApp)
    .description("creating a course")
    .script({
      suppose: [
        fact("the app is loaded", async (context) => {
          await context.loadCourses()
        })
      ],
      perform: [
        step("navigate to the create course page", async (context) => {
          await context.display.createCourseButton.click()
          await context.waitForCreateCoursePage()
        })
      ],
      observe: [
        effect("it navigates to the create course page", async (context) => {
          await expect(context.display.select("h1").text(),
            resolvesTo(stringContaining("Create Course"))
          )
        })
      ]
    }).andThen({
      perform: [
        step("enter a course name", async (context) => {
          await context.courseFormDisplay.courseNameInput.type("New Test Course")
        }),
        step("add a student", async (context) => {
          await context.courseFormDisplay.studentNameInput.type("Student 1")
          await context.courseFormDisplay.addStudentButton.click()
        }),
        step("add a second student", async (context) => {
          await context.courseFormDisplay.studentNameInput.type("Student 2")
          await context.courseFormDisplay.addStudentButton.click()
        }),
        step("add a third student", async (context) => {
          await context.courseFormDisplay.studentNameInput.type("Student 3")
          await context.courseFormDisplay.addStudentButton.click()
        }),
        step("save the course", async (context) => {
          await context.courseFormDisplay.saveCourseButton.click()
        })
      ],
      observe: [
        effect("the new course appears in the list", async (context) => {
          await context.display.courseNames.atIndex(0).isVisible()
          await expect(context.display.courseNames.texts(),
            resolvesTo(arrayWith([
              stringContaining("New Test Course")
            ]))
          )
        })
      ]
    }).andThen({
      perform: [
        step("load the groups for the new course page", async (context) => {
          await context.display.navigateToCourseGroups(0)
        }),
        step("create a new group", async (context) => {
          await context.courseGroupsDisplay.createNewGroupsButton.click()
        })
      ],
      observe: [
        effect("the new students are available to be put into groups", async (context) => {
          await expect(context.courseGroupsDisplay.groupSetForm.group(0).members.texts(), resolvesTo(arrayWith([
            equalTo("Student 1"),
            equalTo("Student 2"),
            equalTo("Student 3")
          ], { withAnyOrder: true })))
        })
      ]
    })

])