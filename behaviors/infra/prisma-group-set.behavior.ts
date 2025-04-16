import { behavior, example, effect, fact, step } from "best-behavior"
import { expect, is, equalTo, arrayWith, objectWith } from "great-expectations"
import { DateTime } from "luxon"
import { Group } from "../../src/domain/group"
import { testableDatabase } from "./helpers/testableDatabase"
import { testCourse } from "../domain/helpers/testCourse"
import { testStudents } from "../domain/helpers/testStudent"
import { groupWithMembers, studentName } from "../domain/helpers/matchers"
import { testTeacher } from "../app/helpers/testTeacher"

export default behavior("Persisting GroupSets", [
  example(testableDatabase)
    .description("writes and reads a group set")
    .script({
      suppose: [
        fact("there is a course with students", async (context) => {
          await context.withCourse(
            testTeacher(1),
            testCourse(1).withStudents(testStudents(4)),
          )
        }),
      ],
      perform: [
        step(
          "a group set is created and written to the database",
          async (context) => {
            const course = await context.getCourseValue(
              testTeacher(1),
              testCourse(1),
            )

            const group1: Group = {
              members: new Set([course.students[0], course.students[1]]),
            }

            const group2: Group = {
              members: new Set([course.students[2], course.students[3]]),
            }

            const createdGroupSet = await context.createGroupSet({
              name: "Fun Set of Groups",
              courseId: course.id,
              createdAt: DateTime.fromISO("2025-04-01T12:12:33.123+06:00"),
              groups: [group1, group2],
            })

            expect(
              createdGroupSet,
              is(
                objectWith({
                  name: equalTo("Fun Set of Groups"),
                  createdAt: equalTo(
                    DateTime.fromISO("2025-04-01T12:12:33.123+06:00"),
                  ),
                  groups: arrayWith<Group>(
                    [
                      groupWithMembers([studentName(1), studentName(2)]),
                      groupWithMembers([studentName(3), studentName(4)]),
                    ],
                    { withAnyOrder: true },
                  ),
                }),
              ),
            )
          },
        ),
      ],
      observe: [
        effect("the group set can be found by course ID", async (context) => {
          const groupSets = await context.getGroupSetsForCourse(testCourse(1))

          expect(
            groupSets,
            is(
              arrayWith([
                objectWith({
                  name: equalTo("Fun Set of Groups"),
                  createdAt: equalTo(
                    DateTime.fromISO("2025-04-01T12:12:33.123+06:00"),
                  ),
                  groups: arrayWith<Group>(
                    [
                      groupWithMembers([studentName(1), studentName(2)]),
                      groupWithMembers([studentName(3), studentName(4)]),
                    ],
                    { withAnyOrder: true },
                  ),
                }),
              ]),
            ),
          )
        }),
      ],
    }),

  example(testableDatabase)
    .description(
      "reads group sets ordered by creation date in descending order",
    )
    .script({
      suppose: [
        fact(
          "there is a course with multiple group sets created at different times",
          async (context) => {
            await context.withCourse(
              testTeacher(1),
              testCourse(1).withStudents(testStudents(4)),
            )

            const course = await context.getCourseValue(
              testTeacher(1),
              testCourse(1),
            )

            const group1: Group = {
              members: new Set([course.students[0], course.students[1]]),
            }

            const group2: Group = {
              members: new Set([course.students[2], course.students[3]]),
            }

            // Create an older group set
            await context.createGroupSet({
              name: "Older Group Set",
              courseId: course.id,
              createdAt: DateTime.fromISO("2025-03-01T12:00:00.000+00:00"),
              groups: [group1, group2],
            })

            // Create a newer group set
            await context.createGroupSet({
              name: "Newer Group Set",
              courseId: course.id,
              createdAt: DateTime.fromISO("2025-04-01T12:00:00.000+00:00"),
              groups: [group1, group2],
            })
          },
        ),
      ],
      observe: [
        effect(
          "the group sets are returned with newest first",
          async (context) => {
            const groupSets = await context.getGroupSetsForCourse(testCourse(1))

            expect(groupSets.length, is(2))
            expect(groupSets[0].name, is("Newer Group Set"))
            expect(
              groupSets[0].createdAt,
              is(equalTo(DateTime.fromISO("2025-04-01T12:00:00.000+00:00"))),
            )
            expect(groupSets[1].name, is("Older Group Set"))
            expect(
              groupSets[1].createdAt,
              is(equalTo(DateTime.fromISO("2025-03-01T12:00:00.000+00:00"))),
            )
          },
        ),
      ],
    }),
])
