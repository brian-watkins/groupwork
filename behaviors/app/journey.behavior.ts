import { behavior, effect, example, fact, Script, step } from "best-behavior"
import { testableApp, TestApp } from "./helpers/testableApp"
import {
  arrayContaining,
  arrayWith,
  equalTo,
  expect,
  is,
  resolvesTo,
  stringContaining,
} from "great-expectations"
import { testCourse } from "../domain/helpers/testCourse"
import { authenticatedTeacher, testTeacher } from "./helpers/testTeacher"
import { testStudent, testStudents } from "../domain/helpers/testStudent"

const showCoursesForAuthenticatedTeacher: Script<TestApp> = {
  suppose: [
    fact(
      "there are existing courses for the authenticated teacher and another teacher",
      async (context) => {
        await context
          .withCourses(authenticatedTeacher(), [
            testCourse(1).withStudents([
              testStudent(1),
              testStudent(2),
              testStudent(3),
            ]),
            testCourse(2).withStudents([testStudent(4), testStudent(5)]),
          ])
          .withCourses(testTeacher(1), [
            testCourse(3).withStudents(testStudents(5, { startingIndex: 15 })),
          ])
          .setupDB()
      },
    ),
    fact("the app is loaded", async (context) => {
      await context.loadCourses()
    }),
  ],
  observe: [
    effect("the welcome page is displayed", async (context) => {
      await expect(
        context.display.select("h1").text(),
        resolvesTo(stringContaining("Welcome")),
      )
    }),
    effect("course list is displayed", async (context) => {
      await expect(
        context.display.courseNames.texts(),
        resolvesTo([testCourse(1).name, testCourse(2).name]),
      )
    }),
  ],
}

const cancelCreateCourse: Script<TestApp> = {
  perform: [
    step("navigate to the create course page", async (context) => {
      await context.display.createCourseButton.click()
      await context.waitForCreateCoursePage()
    }),
    step("click the cancel button", async (context) => {
      await context.courseFormDisplay.cancelButton.click()
      await context.waitForCoursesPage()
    }),
  ],
  observe: [
    effect("course list is displayed", async (context) => {
      await expect(
        context.display.courseNames.texts(),
        resolvesTo([testCourse(1).name, testCourse(2).name]),
      )
    }),
  ],
}

const createCourse: Script<TestApp> = {
  perform: [
    step("navigate to the create course page", async (context) => {
      await context.display.createCourseButton.click()
      await context.waitForCreateCoursePage()
    }),
    step("enter a course name", async (context) => {
      await context.courseFormDisplay.courseNameInput.type(
        "Journey Test Course",
      )
    }),
    step("add four students", async (context) => {
      await context.courseFormDisplay.studentNameInput.type("Student A")
      await context.courseFormDisplay.addStudentButton.click()

      await context.courseFormDisplay.studentNameInput.type("Student B")
      await context.courseFormDisplay.addStudentButton.click()

      await context.courseFormDisplay.studentNameInput.type("Student C")
      await context.courseFormDisplay.addStudentButton.click()

      await context.courseFormDisplay.studentNameInput.type("Student D")
      await context.courseFormDisplay.addStudentButton.click()

      await context.courseFormDisplay.studentNameInput.type("Student E")
      await context.courseFormDisplay.addStudentButton.click()

      await context.courseFormDisplay.studentNameInput.type("Student F")
      await context.courseFormDisplay.addStudentButton.click()
    }),
    step("save the course", async (context) => {
      await context.courseFormDisplay.saveCourseButton.click()
      await context.waitForCoursesPage()
    }),
  ],
  observe: [
    effect("the new course appears in the list", async (context) => {
      await expect(
        context.display.courseNames.texts(),
        resolvesTo(arrayContaining(stringContaining("Journey Test Course"))),
      )
    }),
  ],
}

const cancelEditCourse: Script<TestApp> = {
  perform: [
    step("select the course to edit", async (context) => {
      await context.display
        .courseByName("Journey Test Course")
        .editButton.click()
      await context.waitForEditCoursePage()
    }),
    step("cancel editing", async (context) => {
      await context.courseFormDisplay.cancelButton.click()
      await context.waitForCoursesPage()
    }),
  ],
  observe: [
    effect("the new course still appears in the list", async (context) => {
      await expect(
        context.display.courseNames.texts(),
        resolvesTo(arrayContaining(stringContaining("Journey Test Course"))),
      )
    }),
  ],
}

const editCourse: Script<TestApp> = {
  perform: [
    step("select the course to edit", async (context) => {
      await context.display
        .courseByName("Journey Test Course")
        .editButton.click()
      await context.waitForEditCoursePage()
    }),
    step("modify the course name", async (context) => {
      await context.courseFormDisplay.courseNameInput.type(
        "Updated Journey Course",
      )
    }),
    step("add a new student", async (context) => {
      await context.courseFormDisplay.studentNameInput.type("Student G")
      await context.courseFormDisplay.addStudentButton.click()
    }),
    step("remove a student", async (context) => {
      await context.courseFormDisplay
        .studentByName("Student B")
        .removeButton.click()
    }),
    step("save the course", async (context) => {
      await context.courseFormDisplay.saveCourseButton.click()
      await context.waitForCoursesPage()
    }),
  ],
  observe: [
    effect("the updated course is in the list", async (context) => {
      await expect(
        context.display.courseNames.texts(),
        resolvesTo(arrayContaining(stringContaining("Updated Journey Course"))),
      )
    }),
  ],
}

const navigateToCourseGroups: Script<TestApp> = {
  perform: [
    step("navigate to groups page for course", async (context) => {
      await context.display.courseByName("Updated Journey Course").name.click()
    }),
  ],
}

const cancelCreateGroupSet: Script<TestApp> = {
  perform: [
    step("navigate to the course groups page", async (context) => {
      await context.courseGroupsDisplay.createNewGroupsButton.click()
    }),
    step("cancel create new groups", async (context) => {
      await context.courseGroupsDisplay.groupSetForm.cancelButton.click()
    }),
  ],
  observe: [
    effect("the group set form is hidden", async (context) => {
      await context.courseGroupsDisplay.groupSetForm.waitForHidden()
    }),
  ],
}

const createGroupSet: Script<TestApp> = {
  perform: [
    step("navigate to the course groups page", async (context) => {
      await context.courseGroupsDisplay.createNewGroupsButton.click()
    }),
    step("change the group size to 3 and assign students", async (context) => {
      await context.courseGroupsDisplay.groupSizeInput.type("3")
      await context.courseGroupsDisplay.assignGroupsButton.click()
      await context.courseGroupsDisplay.groupSetForm.waitForGroups(2)
    }),
    step("record the group set", async (context) => {
      await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type(
        "Journey Group Set",
      )
      await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()
      await context.courseGroupsDisplay.groupSetForm.waitForHidden()
      await context.courseGroupsDisplay.groupSet(0).waitForVisible()
    }),
  ],
  observe: [
    effect("the group set appears with the correct name", async (context) => {
      await expect(
        context.courseGroupsDisplay.groupSet(0).name.text(),
        resolvesTo("Journey Group Set"),
      )
    }),
    effect(
      "the two groups contain the expected number of students",
      async (context) => {
        await expect(
          context.courseGroupsDisplay.groupSet(0).groups.count(),
          resolvesTo(2),
        )
        const allStudentNames = await context.courseGroupsDisplay
          .groupSet(0)
          .members.texts()
        expect(
          allStudentNames.sort(),
          is(
            arrayWith(
              [
                equalTo("Student A"),
                equalTo("Student D"),
                equalTo("Student C"),
                equalTo("Student E"),
                equalTo("Student F"),
                equalTo("Student G"),
              ],
              { withAnyOrder: true },
            ),
          ),
        )
      },
    ),
  ],
}

const createAnotherGroupSet: Script<TestApp> = {
  perform: [
    step("navigate to the course groups page", async (context) => {
      await context.courseGroupsDisplay.createNewGroupsButton.click()
    }),
    step(
      "use the default group size (2) and assign to groups",
      async (context) => {
        await context.courseGroupsDisplay.assignGroupsButton.click()
        await context.courseGroupsDisplay.groupSetForm.waitForGroups(3)
      },
    ),
    step("record the group set", async (context) => {
      await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type(
        "Another Journey Group Set",
      )
      await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()
      await context.courseGroupsDisplay.groupSetForm.waitForHidden()
      await context.courseGroupsDisplay.groupSet(1).waitForVisible()
    }),
  ],
  observe: [
    effect(
      "the new group set appears first in the list with the correct name",
      async (context) => {
        await expect(
          context.courseGroupsDisplay.groupSet(0).name.text(),
          resolvesTo("Another Journey Group Set"),
        )
      },
    ),
    effect(
      "the three groups contain the expected number of students",
      async (context) => {
        await expect(
          context.courseGroupsDisplay.groupSet(0).groups.count(),
          resolvesTo(3),
        )
        const allStudentNames = await context.courseGroupsDisplay
          .groupSet(0)
          .members.texts()
        expect(
          allStudentNames.sort(),
          is(
            arrayWith(
              [
                equalTo("Student A"),
                equalTo("Student D"),
                equalTo("Student C"),
                equalTo("Student E"),
                equalTo("Student F"),
                equalTo("Student G"),
              ],
              { withAnyOrder: true },
            ),
          ),
        )
      },
    ),
  ],
}

const cancelEditGroupSet: Script<TestApp> = {
  perform: [
    step("click the edit icon on the group set", async (context) => {
      await context.courseGroupsDisplay.groupSet(0).editButton.click()
      await context.courseGroupsDisplay.groupSetForm.waitForVisible()
    }),
    step("cancel the edit", async (context) => {
      await context.courseGroupsDisplay.groupSetForm.cancelButton.click()
    }),
  ],
  observe: [
    effect("the group set form is hidden", async (context) => {
      await expect(
        context.courseGroupsDisplay.groupSetForm.isHidden(),
        resolvesTo(true),
      )
    }),
  ],
}

const editGroupSet: Script<TestApp> = {
  perform: [
    step("click the edit icon on the group set", async (context) => {
      await context.courseGroupsDisplay.groupSet(1).editButton.click()
      await context.courseGroupsDisplay.groupSetForm.waitForVisible()
    }),
    step("move a student from group 1 to group 2", async (context) => {
      await context.courseGroupsDisplay.groupSetForm.waitForGroups(2)
      const studentToDrag = context.courseGroupsDisplay.groupSetForm
        .group(0)
        .member(0)
      await studentToDrag.dragTo(
        context.courseGroupsDisplay.groupSetForm.group(1),
      )
      await context.courseGroupsDisplay.groupSetForm
        .group(1)
        .member(2)
        .waitForVisible()
    }),
    step("change the group set name", async (context) => {
      await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type(
        "Edited Group Set",
      )
    }),
    step("save the edited group set", async (context) => {
      await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()
      await context.courseGroupsDisplay.groupSetForm.waitForHidden()
    }),
  ],
  observe: [
    effect("the group set name is updated", async (context) => {
      await expect(
        context.courseGroupsDisplay.groupSet(1).name.text(),
        resolvesTo("Edited Group Set"),
      )
    }),
    effect("the groups are updated with the moved student", async (context) => {
      await expect(
        context.courseGroupsDisplay.groupSet(1).groups.count(),
        resolvesTo(2),
      )
      await expect(
        context.courseGroupsDisplay.groupSet(1).group(0).members.count(),
        resolvesTo(2),
      )
      await expect(
        context.courseGroupsDisplay.groupSet(1).group(1).members.count(),
        resolvesTo(4),
      )
    }),
  ],
}

const cancelDeleteGroupSet: Script<TestApp> = {
  perform: [
    step("delete the group set", async (context) => {
      await context.courseGroupsDisplay.groupSet(1).deleteButton.click()
      await context.courseGroupsDisplay.deleteGroupSetConfirmationModal.waitForVisible()
    }),
    step("cancel the delete", async (context) => {
      await context.courseGroupsDisplay.deleteGroupSetConfirmationModal.cancelButton.click()
    }),
  ],
  observe: [
    effect("the modal is hidden", async (context) => {
      await expect(
        context.courseGroupsDisplay.deleteGroupSetConfirmationModal.isHidden(),
        resolvesTo(true),
      )
    }),
    effect("the group set is still present", async (context) => {
      await expect(
        context.courseGroupsDisplay.groupSet(1).isVisible(),
        resolvesTo(true),
      )
    }),
  ],
}

const deleteGroupSet: Script<TestApp> = {
  perform: [
    step("delete the group set", async (context) => {
      await context.courseGroupsDisplay.groupSet(1).deleteButton.click()
      await context.courseGroupsDisplay.deleteGroupSetConfirmationModal.waitForVisible()
      await context.courseGroupsDisplay.deleteGroupSetConfirmationModal.deleteButton.click()
    }),
  ],
  observe: [
    effect("the modal is closed", async (context) => {
      await expect(
        context.courseGroupsDisplay.deleteGroupSetConfirmationModal.isHidden(),
        resolvesTo(true),
      )
    }),
    effect("group set is deleted", async (context) => {
      await expect(
        context.courseGroupsDisplay.groupSet(1).isHidden(),
        resolvesTo(true),
      )
    }),
  ],
}

const cancelDeleteCourse: Script<TestApp> = {
  perform: [
    step("click to delete the course", async (context) => {
      await context.display
        .courseByName("Updated Journey Course")
        .deleteButton.click()
    }),
    step("click the cancel button", async (context) => {
      await context.display.deleteCourseConfirmationModal.cancelButton.click()
    }),
  ],
  observe: [
    effect("the modal is closed", async (context) => {
      await expect(
        context.display.deleteCourseConfirmationModal.isHidden(),
        resolvesTo(true),
      )
    }),
    effect("the course is still displayed", async (context) => {
      await expect(
        context.display.courseNames.texts(),
        resolvesTo(arrayContaining(equalTo("Updated Journey Course"))),
      )
    }),
  ],
}

const deleteCourse: Script<TestApp> = {
  perform: [
    step("delete the course", async (context) => {
      await context.display
        .courseByName("Updated Journey Course")
        .deleteButton.click()
      await context.display.deleteCourseConfirmationModal.waitForVisible()
      await context.display.deleteCourseConfirmationModal.deleteButton.click()
      await context.display
        .courseByName("Updated Journey Course")
        .waitForHidden()
    }),
  ],
  observe: [
    effect("the course is removed from the list", async (context) => {
      await expect(
        context.display.courseNames.texts(),
        resolvesTo(
          arrayContaining(
            stringContaining("Updated Journey Course", { times: 0 }),
          ),
        ),
      )
    }),
  ],
}

const backToCoursesPage: Script<TestApp> = {
  perform: [
    step("navigate back to courses page", async (context) => {
      await context.display.navigateToCourses()
      await context.waitForCoursesPage()
    }),
  ],
}

export default behavior("Journey", [
  example(testableApp)
    .script(showCoursesForAuthenticatedTeacher)
    .andThen(cancelCreateCourse)
    .andThen(createCourse)
    .andThen(cancelEditCourse)
    .andThen(editCourse)
    .andThen(navigateToCourseGroups)
    .andThen(cancelCreateGroupSet)
    .andThen(createGroupSet)
    .andThen(createAnotherGroupSet)
    .andThen(cancelEditGroupSet)
    .andThen(editGroupSet)
    .andThen(cancelDeleteGroupSet)
    .andThen(deleteGroupSet)
    .andThen(backToCoursesPage)
    .andThen(cancelDeleteCourse)
    .andThen(deleteCourse),
])
