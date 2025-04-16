import { behavior, effect, example, fact } from "best-behavior"
import { expect, resolvesTo } from "great-expectations"
import { testableDatabase } from "./helpers/testableDatabase"
import { testTeacher } from "../app/helpers/testTeacher"
import { testCourse } from "../domain/helpers/testCourse"

export default behavior("PrismaTeacherAuthorization", [
  example(testableDatabase)
    .description("teacher who owns a course can manage it")
    .script({
      suppose: [
        fact("there is a course owned by a teacher", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1))
        }),
      ],
      observe: [
        effect(
          "the owner teacher is authorized to manage the course",
          async (context) => {
            await expect(
              context.canManageCourse(testTeacher(1), testCourse(1)),
              resolvesTo(true),
            )
          },
        ),
      ],
    }),

  example(testableDatabase)
    .description("teacher who doesn't own a course cannot manage it")
    .script({
      suppose: [
        fact("there is a course owned by a teacher", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1))
        }),
      ],
      observe: [
        effect(
          "the non-owner teacher is not authorized to manage the course",
          async (context) => {
            await expect(
              context.canManageCourse(testTeacher(2), testCourse(1)),
              resolvesTo(false),
            )
          },
        ),
      ],
    }),

  example(testableDatabase)
    .description("teacher cannot manage a non-existent course")
    .script({
      observe: [
        effect(
          "the teacher is not authorized to manage a non-existent course",
          async (context) => {
            await expect(
              context.canManageCourse(testTeacher(1), testCourse(99)),
              resolvesTo(false),
            )
          },
        ),
      ],
    }),
])
