import { behavior, example, effect, fact, step } from "best-behavior"
import { expect, is, equalTo } from "great-expectations"
import { testCourse } from "../domain/helpers/testCourse"
import { testStudents } from "../domain/helpers/testStudent"
import { testableDatabase } from "./helpers/testableDatabase"
import { testTeacher } from "../app/helpers/testTeacher"
import { testGroup } from "../domain/helpers/testGroup"

export default behavior("PrismaGroupSetWriter #delete", [
  example(testableDatabase)
    .description(
      "delete removes a group set and all its groups from the database",
    )
    .script({
      suppose: [
        fact(
          "there is an existing group set in the database",
          async (context) => {
            await context.withCourse(
              testTeacher(1),
              testCourse(1).withStudents(testStudents(6)),
            )
            const course = await context.getCourseValue(
              testTeacher(1),
              testCourse(1),
            )

            await context.createGroupSet({
              courseId: course.id,
              name: "Group Set To Delete",
              groups: [
                testGroup(
                  course.students[0],
                  course.students[1],
                  course.students[2],
                ),
                testGroup(
                  course.students[3],
                  course.students[4],
                  course.students[5],
                ),
              ],
            })
          },
        ),
      ],
      perform: [
        step("delete the group set", async (context) => {
          const groupSets = await context.getGroupSetsForCourse(testCourse(1))
          await context.deleteGroupSet(groupSets[0])
        }),
      ],
      observe: [
        effect(
          "the group set is removed from the database",
          async (context) => {
            const groupSets = await context.getGroupSetsForCourse(testCourse(1))
            expect(groupSets.length, is(equalTo(0)))
          },
        ),
      ],
    }),
])
