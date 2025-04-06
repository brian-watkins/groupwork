import { behavior, example, fact, step, effect } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { expect, resolvesTo, stringContaining, arrayWith, equalTo, is } from "great-expectations";
import { testStudent } from "../domain/helpers/testStudent";
import { testCourse } from "../domain/helpers/testCourse";

export default behavior("edit course", [

  example(testableApp)
    .description("editing an existing course and its students")
    .script({
      suppose: [
        fact("there is an existing course with students", async (context) => {
          await context
            .withCourses([
              testCourse(1).withStudents([
                testStudent(1),
                testStudent(2),
                testStudent(3),
              ])
            ])
            .load()
        })
      ],
      perform: [
        step("click the edit course button", async (context) => {
          await context.display.course(0).editButton.click()
        })
      ],
      observe: [
        effect("it navigates to the edit course page", async (context) => {
          await context.page.waitForURL('**/courses/*/edit')
          await expect(context.display.select("h1").text(),
            resolvesTo(stringContaining("Edit Course"))
          )
        }),
        effect("the form is populated with course details", async (context) => {
          await expect(context.courseFormDisplay.courseNameInput.inputValue(),
            resolvesTo(equalTo("Course #1"))
          )
        }),
        effect("the student list is populated", async (context) => {
          await expect(context.courseFormDisplay.studentNames(),
            resolvesTo(arrayWith([
              equalTo("Fun Student 1"),
              equalTo("Fun Student 2"),
              equalTo("Fun Student 3")
            ]))
          )
        })
      ]
    }).andThen({
      perform: [
        step("modify the course name", async (context) => {
          await context.courseFormDisplay.courseNameInput.clear()
          await context.courseFormDisplay.courseNameInput.type("Updated Course Name")
        }),
        step("add a new student", async (context) => {
          await context.courseFormDisplay.studentNameInput.type("New Student")
          await context.courseFormDisplay.addStudentButton.click()
        }),
        step("remove a student", async (context) => {
          await context.courseFormDisplay.student(1).removeButton.click()
        }),
        step("save the course", async (context) => {
          await context.courseFormDisplay.saveCourseButton.click()
          await context.waitForHomePage()
        })
      ],
      observe: [
        effect("it shows the courses page", async (context) => {
          await expect(context.display.select("h1").text(),
            resolvesTo(stringContaining("Welcome"))
          )
        }),
        effect("the course is updated in the list", async (context) => {
          await expect(context.display.courseNames.texts(), resolvesTo([
            "Updated Course Name"
          ]))
        })
      ]
    }).andThen({
      perform: [
        step("view the groups for the updated course", async (context) => {
          await context.display.navigateToCourseGroups(0)
          await context.courseGroupsDisplay.createNewGroupsButton.click()
        })
      ],
      observe: [
        effect("the course has the updated students", async (context) => {
          await expect(context.courseGroupsDisplay.groupSetForm.group(0).members.texts(),
            resolvesTo(arrayWith([
              equalTo("Fun Student 2"),
              equalTo("Fun Student 3"),
              equalTo("New Student")
            ], { withAnyOrder: true }))
          )
        })
      ]
    })

])
