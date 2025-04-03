import { behavior, example, fact, effect } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { expect, resolvesTo, stringContaining } from "great-expectations";
import { testStudent } from "../domain/helpers/testStudent";
import { testCourse } from "../domain/helpers/testCourse";

export default behavior("courses page", [

  example(testableApp)
    .description("show a list of courses")
    .script({
      suppose: [
        fact("the app is loaded", async (context) => {
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
      observe: [
        effect("the page title is displayed", async (context) => {
          await expect(context.display.select("h1").text(),
            resolvesTo(stringContaining("Welcome"))
          )
        }),
        effect("course list is displayed", async (context) => {
          await expect(context.display.courses.texts(), resolvesTo([
            testCourse(1).name,
            testCourse(2).name
          ]))
        })
      ]
    })

])