import { behavior, effect, example, fact, step } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { testCourse } from "../domain/helpers/testCourse";
import { testStudent, testStudents } from "../domain/helpers/testStudent";
import { arrayWith, arrayWithLength, expect, is, resolvesTo } from "great-expectations";
import { studentName } from "./helpers/matchers";

export default behavior("record groups", [

  example(testableApp)
    .description("record groups after manual adjustment")
    .script({
      suppose: [
        fact("the app is loaded with a course that has students", async (context) => {
          await context
            .withCourses([
              testCourse(1).withStudents(testStudents(4))
            ])
            .loadCourseGroups(0)
        })
      ],
      perform: [
        step("click the 'Create New Groups' button", async (context) => {
          await context.courseGroupsDisplay.createNewGroupsButton.click()
        }),
        step("create some groups", async (context) => {
          await context.courseGroupsDisplay.assignGroupsButton.click()
          await context.courseGroupsDisplay.groupSetForm.waitForGroups(2)
        }),
        step("name the group set", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type("Manually Adjusted Groups")
        }),
        step("manually move a student from group 1 to group 2", async (context) => {
          const studentToDrag = context.courseGroupsDisplay.groupSetForm.group(0).member(0)
          await studentToDrag.dragTo(context.courseGroupsDisplay.groupSetForm.group(1))
          await context.courseGroupsDisplay.groupSetForm.group(1).member(2).waitForVisible()
        }),
        step("record the adjusted groups", async (context) => {
          await context.display.pause(50)
          await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()
          await context.courseGroupsDisplay.groupSet(0).group(1).waitForVisible()
          await context.display.pause(50)
        })
      ],
      observe: [
        effect("the first group should have one student", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).group(0).members.count(), resolvesTo(1))
        }),
        effect("the second group should have three students", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).group(1).members.count(), resolvesTo(3))
        }),
        effect("the groups should contain all students", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).allMembers.texts(), resolvesTo(arrayWith([
            studentName(testStudent(1)),
            studentName(testStudent(2)),
            studentName(testStudent(3)),
            studentName(testStudent(4))
          ], { withAnyOrder: true })))
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
        step("click the 'Create New Groups' button", async (context) => {
          await context.courseGroupsDisplay.createNewGroupsButton.click()
        }),
        step("create some groups", async (context) => {
          await context.courseGroupsDisplay.assignGroupsButton.click()
          await context.courseGroupsDisplay.groupSetForm.waitForGroups(2)
        }),
        step("name the group set", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type("First Group Set")
        }),
        step("click the 'Record Groups' button", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()
          await context.courseGroupsDisplay.groupSet(0).waitForVisible()
        })
      ],
      observe: [
        effect("the form is hidden after recording", async (context) => {
          await expect(context.courseGroupsDisplay.groupSetForm.isHidden(), resolvesTo(true))
        }),
        effect("the new group set appears in the list with the provided name", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).name.text(), resolvesTo(
            "First Group Set"
          ))
        }),
        effect("the new group set is expanded", async (context) => {
          await expect(context.courseGroupsDisplay.groupSet(0).groups.isVisible(), resolvesTo(true))
        })
      ]
    }).andThen({
      perform: [
        step("open the recorded group set", async (context) => {
          await context.courseGroupsDisplay.groupSet(0).click()
        })
      ],
      observe: [
        effect("the first group set is displayed", async (context) => {
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
    }).andThen({
      perform: [
        step("assign students to groups again", async (context) => {
          await context.courseGroupsDisplay.createNewGroupsButton.click()
          await context.courseGroupsDisplay.assignGroupsButton.click()
        }),
        step("record a second group set", async (context) => {
          await context.courseGroupsDisplay.groupSetForm.groupSetNameInput.type("Second Group Set")
          await context.courseGroupsDisplay.groupSetForm.recordGroupsButton.click()
          await context.courseGroupsDisplay.groupSet(1).waitForVisible()
        }),
        step("open the recorded group set", async (context) => {
          await context.courseGroupsDisplay.groupSet(0).click()
        })
      ],
      observe: [
        effect("the second group set is displayed first", async (context) => {
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
        }),
        effect("both group sets are displayed with most recent first", async (context) => {
          await expect(context.courseGroupsDisplay.groupSets.count(), resolvesTo(2))

          await expect(context.courseGroupsDisplay.groupSet(0).name.text(), resolvesTo(
            "Second Group Set"
          ))
          await expect(context.courseGroupsDisplay.groupSet(1).name.text(), resolvesTo(
            "First Group Set"
          ))
        })
      ]
    })

])