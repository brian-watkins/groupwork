import { behavior, example, effect, fact } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { expect, is } from "great-expectations";
import { testTeacher } from "./helpers/testTeacher";
import { testCourse } from "../domain/helpers/testCourse";

export default behavior("groups page", [

  example(testableApp)
    .description("attempt to navigate to a non-existent course")
    .script({
      suppose: [
        fact("there is a course for another teacher", async (context) => {
          await context.withCourses(testTeacher(1), [
            testCourse(1),
            testCourse(2)
          ])
            .setupDB()
        })
      ],
      observe: [
        effect("attempt to load course by another teacher results in a 404", async (context) => {
          const response = await context.loadGroupsForCourse(testCourse(2))
          expect(response!.status(), is(404))
        })
      ]
    })

])