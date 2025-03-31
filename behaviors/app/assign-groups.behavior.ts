import { behavior, example, effect, fact, step } from "best-behavior";
import { expect, is, equalTo, resolvesTo, stringContaining } from "great-expectations";
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
            .loadCourse(0)
        })
      ],
      perform: [
        step("clicking the 'Assign to Groups' button", async (browser) => {
          await browser.display.select("[data-assign-groups-button]").click()
        })
      ],
      observe: [
        effect("displays the students in their assigned groups", async (browser) => {
          await browser.display.select("[data-student-group]:nth-child(2)").waitForVisible()
          await expect(browser.display.selectAll("[data-student-group]").count(), resolvesTo(2))

          const group1StudentCount = await browser.display
            .selectAll("[data-student-group]")
            .atIndex(0)
            .selectAllDescendants("[data-group-member]")
            .count()

          const group2StudentCount = await browser.display
            .selectAll("[data-student-group]")
            .atIndex(1)
            .selectAllDescendants("[data-group-member]")
            .count()

          expect(group1StudentCount, is(2));
          expect(group2StudentCount, is(3));
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
            .loadCourse(0)
        })
      ],
      observe: [
        effect("the group size input has a default value of 2", async (browser) => {
          await expect(browser.display.select("[data-group-size-input]").inputValue(), resolvesTo("2"))
        })
      ]
    }).andThen({
      perform: [
        step("changing the group size to 3", async (browser) => {
          await browser.display.select("[data-group-size-input]").type("3")
          await browser.display.select("[data-assign-groups-button]").click()
        })
      ],
      observe: [
        effect("creates groups with the specified size", async (browser) => {
          await browser.display.select("[data-student-group]:nth-child(3)").waitForVisible()
          await expect(browser.display.selectAll("[data-student-group]").count(), resolvesTo(3))

          const group1StudentCount = await browser.display
            .selectAll("[data-student-group]")
            .atIndex(0)
            .selectAllDescendants("[data-group-member]")
            .count()

          const group2StudentCount = await browser.display
            .selectAll("[data-student-group]")
            .atIndex(1)
            .selectAllDescendants("[data-group-member]")
            .count()

          const group3StudentCount = await browser.display
            .selectAll("[data-student-group]")
            .atIndex(2)
            .selectAllDescendants("[data-group-member]")
            .count()

          expect(group1StudentCount, is(3))
          expect(group2StudentCount, is(3))
          expect(group3StudentCount, is(3))
        })
      ]
    })

])