import { behavior, example, effect, fact, step } from "best-behavior";
import { arrayWith, equalTo, expect, is, resolvesTo } from "great-expectations";
import { testableApp } from "./helpers/testableApp";
import { testCourse } from "../domain/helpers/testCourse";
import { testStudents } from "../domain/helpers/testStudent";

export default behavior("Assign Students to Groups", [

  example(testableApp)
    .description("assigning students to groups from the course page")
    .script({
      suppose: [
        fact("the user is viewing a course with students", async (context) => {
          await context
            .withCourses([
              testCourse(1).withStudents(testStudents(5))
            ])
            .loadCourseGroups(0)
        })
      ],
      perform: [
        step("click the 'Create New Groups' button", async (browser) => {
          await browser.courseGroupsDisplay.createNewGroupsButton.click()
        }),
        step("click the 'Assign to Groups' button", async (browser) => {
          await browser.courseGroupsDisplay.assignGroupsButton.click()
        })
      ],
      observe: [
        effect("displays the students in their assigned groups", async (browser) => {
          await browser.courseGroupsDisplay.groupSetForm.waitForGroups(2)
          await expect(browser.courseGroupsDisplay.groupSetForm.groups.count(), resolvesTo(2))

          const group1Count = await browser.courseGroupsDisplay.groupSetForm.group(0).members.count()
          const group2Count = await browser.courseGroupsDisplay.groupSetForm.group(1).members.count()

          expect([ group1Count, group2Count ], is(arrayWith([
            equalTo(2), 
            equalTo(3)
          ], { withAnyOrder: true })))
        })
      ]
    }),

  example(testableApp)
    .description("specifying the number of students per group")
    .script({
      suppose: [
        fact("the user is viewing a course with students", async (context) => {
          await context
            .withCourses([
              testCourse(1).withStudents(testStudents(9))
            ])
            .loadCourseGroups(0)
        })
      ],
      perform: [
        step("clicking the 'Create New Groups' button", async (browser) => {
          await browser.courseGroupsDisplay.createNewGroupsButton.click()
        })
      ],
      observe: [
        effect("the group size input has a default value of 2", async (browser) => {
          await expect(browser.courseGroupsDisplay.groupSizeInput.inputValue(), resolvesTo("2"))
        })
      ]
    }).andThen({
      perform: [
        step("changing the group size to 3", async (browser) => {
          await browser.courseGroupsDisplay.groupSizeInput.type("3")
          await browser.courseGroupsDisplay.assignGroupsButton.click()
        })
      ],
      observe: [
        effect("creates groups with the specified size", async (browser) => {
          await browser.courseGroupsDisplay.groupSetForm.waitForGroups(3)
          
          await expect(browser.courseGroupsDisplay.groupSetForm.groups.count(), resolvesTo(3))
          await expect(browser.courseGroupsDisplay.groupSetForm.group(0).members.count(), resolvesTo(3))
          await expect(browser.courseGroupsDisplay.groupSetForm.group(1).members.count(), resolvesTo(3))
          await expect(browser.courseGroupsDisplay.groupSetForm.group(2).members.count(), resolvesTo(3))
        })
      ]
    })

])