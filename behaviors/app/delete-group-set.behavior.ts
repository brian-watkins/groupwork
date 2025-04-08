import { behavior, effect, example, fact, step } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { testCourse } from "../domain/helpers/testCourse";
import { testStudents } from "../domain/helpers/testStudent";
import { expect, is, resolvesTo, stringContaining, arrayWith, equalTo } from "great-expectations";
import { authenticatedTeacher } from "./helpers/testTeacher";

export default behavior("delete group set", [

  example(testableApp)
    .description("deleting a recorded group set")
    .script({
      suppose: [
        fact("the app is loaded with a course that has students and a recorded group set", async (context) => {
          await context
            .withCourses(authenticatedTeacher(), [
              testCourse(1).withStudents(testStudents(4))
            ])
            .loadCourseGroups(0)
        }),
        fact("a group set is created for the course", async (context) => {
          await context.courseGroupsDisplay.createNewGroupsButton.click()
          await context.courseGroupsDisplay.assignGroupsButton.click()
          await context.courseGroupsDisplay.groupSetForm.waitForGroups(2)
          await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type("Group Set to Delete")
          await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()
          await context.courseGroupsDisplay.groupSet(0).waitForVisible()
        })
      ],
      perform: [
        step("click the delete icon on the group set", async (context) => {
          await context.courseGroupsDisplay.groupSet(0).deleteButton.click()
        })
      ],
      observe: [
        effect("it shows a confirmation modal", async (context) => {
          await expect(context.courseGroupsDisplay.deleteGroupSetConfirmationModal.isVisible(), resolvesTo(true))
        }),
        effect("the modal displays the group set name", async (context) => {
          await expect(context.courseGroupsDisplay.deleteGroupSetConfirmationModal.message.text(),
            resolvesTo(stringContaining("Group Set to Delete"))
          )
        }),
        effect("the modal has a cancel button", async (context) => {
          await expect(context.courseGroupsDisplay.deleteGroupSetConfirmationModal.cancelButton.isVisible(), 
            resolvesTo(true))
        }),
        effect("the modal has a delete button", async (context) => {
          await expect(context.courseGroupsDisplay.deleteGroupSetConfirmationModal.deleteButton.isVisible(), 
            resolvesTo(true))
        })
      ]
    }).andThen({
      perform: [
        step("click the cancel button", async (context) => {
          await context.courseGroupsDisplay.deleteGroupSetConfirmationModal.cancelButton.click()
        })
      ],
      observe: [
        effect("the modal is closed", async (context) => {
          await expect(context.courseGroupsDisplay.deleteGroupSetConfirmationModal.isHidden(),
            resolvesTo(true)
          )
        }),
        effect("the group set still exists", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).name.text(), 
            resolvesTo("Group Set to Delete")
          )
        })
      ]
    }).andThen({
      perform: [
        step("click the delete group set button again", async (context) => {
          await context.courseGroupsDisplay.groupSet(0).deleteButton.click()
        }),
        step("click the confirm delete button in the modal", async (context) => {
          await context.courseGroupsDisplay.deleteGroupSetConfirmationModal.deleteButton.click()
        })
      ],
      observe: [
        effect("the modal is closed", async (context) => {
          await expect(context.courseGroupsDisplay.deleteGroupSetConfirmationModal.isHidden(),
            resolvesTo(true)
          )
        }),
        effect("the group set is removed from the list", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).isHidden(), resolvesTo(true))
        })
      ]
    })

])
