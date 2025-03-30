import { behavior, example, effect, fact, step } from "best-behavior";
import { expect, is, equalTo } from "great-expectations";
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
          await browser.page.click('[data-testid="assign-groups-button"]');
        })
      ],
      observe: [
        effect("displays the students in their assigned groups", async (browser) => {
          await browser.page.waitForSelector('[data-groups]');

          const groupElements = await browser.page.locator('[data-student-group]').all();
          expect(groupElements.length, is(equalTo(2)));

          const group1Students = await browser.page.locator('[data-student-group]:nth-child(1) [data-group-member]').all();
          const group2Students = await browser.page.locator('[data-student-group]:nth-child(2) [data-group-member]').all();

          expect(group1Students.length, is(equalTo(2)));
          expect(group2Students.length, is(equalTo(3)));
        })
      ]
    })

])