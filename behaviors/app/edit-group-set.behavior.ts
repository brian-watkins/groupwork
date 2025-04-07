import { behavior, effect, example, fact, step } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { testCourse } from "../domain/helpers/testCourse";
import { testStudents } from "../domain/helpers/testStudent";
import { expect, resolvesTo } from "great-expectations";
import { authenticatedTeacher } from "./helpers/testTeacher";

export default behavior("edit group set", [

  example(testableApp)
    .description("edit a recorded group set")
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
          await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type("Group Set to Edit")
          await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()
          await context.courseGroupsDisplay.groupSet(0).waitForVisible()
        })
      ],
      perform: [
        step("click the edit icon on the group set", async (context) => {
          await context.courseGroupsDisplay.groupSet(0).editButton.click()
          await context.courseGroupsDisplay.groupSetForm.waitForVisible()
        }),
        step("move a student from group 1 to group 2", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.waitForGroups(2);

          await context.courseGroupsDisplay.groupSetForm.group(0).member(0)
            .dragTo(context.courseGroupsDisplay.groupSetForm.group(1));

          await context.courseGroupsDisplay.groupSetForm.group(1).member(2).waitForVisible();
        }),
        step("change the group set name", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type("Edited Group Set")
        }),
        step("save the edited group set", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()
          await context.courseGroupsDisplay.groupSetForm.waitForHidden()
        })
      ],
      observe: [
        effect("the group set name is updated", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).name.text(), resolvesTo(
            "Edited Group Set"
          ))
        }),
        effect("the first group has one student", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).group(0).members.count(), resolvesTo(1))
        }),
        effect("the second group has three students", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).group(1).members.count(), resolvesTo(3))
        })
      ]
    }),

  example(testableApp)
    .description("cancel editing a group set")
    .script({
      suppose: [
        fact("the app is loaded with a course that has students and a recorded group set", async (context) => {
          await context
            .withCourses(authenticatedTeacher(), [
              testCourse(1).withStudents(testStudents(4))
            ])
            .loadCourseGroups(0)
        }),
        fact("a group set exists for the course", async (context) => {
          await context.courseGroupsDisplay.createNewGroupsButton.click()
          await context.courseGroupsDisplay.assignGroupsButton.click()
          await context.courseGroupsDisplay.groupSetForm.waitForGroups(2)
          await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type("Original Group Set")
          await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()
          await context.courseGroupsDisplay.groupSet(0).waitForVisible()
        })
      ],
      perform: [
        step("click the edit icon on the group set", async (context) => {
          await context.courseGroupsDisplay.groupSet(0).editButton.click()
          await context.courseGroupsDisplay.groupSetForm.waitForVisible()
        }),
        step("change the group set name", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type("Should Not Be Saved")
        }),
        step("cancel the edit", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.cancelButton.click()
          await context.courseGroupsDisplay.groupSetForm.waitForHidden()
        })
      ],
      observe: [
        effect("the group set name remains unchanged", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).name.text(), resolvesTo(
            "Original Group Set"
          ))
        })
      ]
    })
])