import { behavior, example, fact, step, effect } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { expect, resolvesTo, stringContaining, is, arrayWith, equalTo } from "great-expectations";
import { testCourse } from "../domain/helpers/testCourse";
import { testStudent } from "../domain/helpers/testStudent";

export default behavior("delete course", [

  example(testableApp)
    .description("deleting an existing course")
    .script({
      suppose: [
        fact("there are two existing courses", async (context) => {
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
      perform: [
        step("click the delete course button for the first course", async (context) => {
          await context.display.course(0).deleteButton.click()
        })
      ],
      observe: [
        effect("it shows a confirmation modal", async (context) => {
          await expect(context.display.deleteCourseConfirmationModal.isVisible(), resolvesTo(true))
        }),
        effect("the modal displays the course name", async (context) => {
          await expect(context.display.deleteCourseConfirmationModal.message.text(),
            resolvesTo(stringContaining("Course #1"))
          )
        }),
        effect("the modal has a cancel button", async (context) => {
          await expect(context.display.deleteCourseConfirmationModal.cancelButton.isVisible(), resolvesTo(true))
        }),
        effect("the modal has a delete button", async (context) => {
          await expect(context.display.deleteCourseConfirmationModal.deleteButton.isVisible(), resolvesTo(true))
        })
      ]
    }).andThen({
      perform: [
        step("click the cancel button", async (context) => {
          await context.display.deleteCourseConfirmationModal.cancelButton.click()
        })
      ],
      observe: [
        effect("the modal is closed", async (context) => {
          await expect(context.display.deleteCourseConfirmationModal.isHidden(),
            resolvesTo(true)
          )
        }),
        effect("both courses are still displayed", async (context) => {
          await expect(context.display.courseNames.texts(), 
            resolvesTo(arrayWith([
              equalTo("Course #1"),
              equalTo("Course #2")
            ]))
          )
        })
      ]
    }).andThen({
      perform: [
        step("click the delete course button for the first course again", async (context) => {
          await context.display.course(0).deleteButton.click()
        }),
        step("click the delete button in the modal", async (context) => {
          await context.display.deleteCourseConfirmationModal.deleteButton.click()
        })
      ],
      observe: [
        effect("the modal is closed", async (context) => {
          await expect(context.display.deleteCourseConfirmationModal.isHidden(),
            resolvesTo(true)
          )
        }),
        effect("the course is removed from the list", async (context) => {
          await context.display.course(1).waitForHidden()
          await expect(context.display.courseNames.texts(), 
            resolvesTo(arrayWith([
              equalTo("Course #2")
            ]))
          )
        })
      ]
    })

])
