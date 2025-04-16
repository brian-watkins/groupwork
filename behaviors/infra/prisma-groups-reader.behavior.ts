import { behavior, example, effect, fact, step } from "best-behavior"
import { DateTime } from "luxon"
import { expect, is, equalTo, arrayWith } from "great-expectations"
import { Group } from "../../src/domain/group"
import { testableDatabase } from "./helpers/testableDatabase"
import { testCourse } from "../domain/helpers/testCourse"
import { testStudents } from "../domain/helpers/testStudent"
import { groupWithMembers, studentName } from "../domain/helpers/matchers"
import { testTeacher } from "../app/helpers/testTeacher"

export default behavior("PrismaGroupsReader", [
  example(testableDatabase)
    .description("gets all groups for a course")
    .script({
      suppose: [
        fact("there is a course with multiple group sets", async (context) => {
          await context.withCourse(
            testTeacher(1),
            testCourse(1).withStudents(testStudents(6)),
          )

          const course = await context.getCourseValue(
            testTeacher(1),
            testCourse(1),
          )

          // First group set with two groups
          const group1: Group = {
            members: new Set([course.students[0], course.students[1]]),
          }

          const group2: Group = {
            members: new Set([course.students[2], course.students[3]]),
          }

          await context.createGroupSet({
            name: "First Group Set",
            courseId: course.id,
            createdAt: DateTime.fromISO("2025-03-01T12:00:00.000+00:00"),
            groups: [group1, group2],
          })

          // Second group set with one group
          const group3: Group = {
            members: new Set([course.students[4], course.students[5]]),
          }

          await context.createGroupSet({
            name: "Second Group Set",
            courseId: course.id,
            createdAt: DateTime.fromISO("2025-04-01T12:00:00.000+00:00"),
            groups: [group3],
          })
        }),
      ],
      observe: [
        effect(
          "it gets all groups flattened from all group sets",
          async (context) => {
            const groups = await context.getGroupsForCourse(testCourse(1))

            expect(groups.length, is(equalTo(3)))
            expect(
              groups,
              is(
                arrayWith<Group>(
                  [
                    groupWithMembers([studentName(1), studentName(2)]),
                    groupWithMembers([studentName(3), studentName(4)]),
                    groupWithMembers([studentName(5), studentName(6)]),
                  ],
                  { withAnyOrder: true },
                ),
              ),
            )
          },
        ),
      ],
    }),

  example(testableDatabase)
    .description("handles a course with no groups")
    .script({
      suppose: [
        fact(
          "there is a course with students but no groups",
          async (context) => {
            await context.withCourse(
              testTeacher(1),
              testCourse(1).withStudents(testStudents(3)),
            )
          },
        ),
      ],
      observe: [
        effect("it returns an empty array", async (context) => {
          const groups = await context.getGroupsForCourse(testCourse(1))
          expect(groups, is(arrayWith([])))
        }),
      ],
    }),

  example(testableDatabase)
    .description("handles multiple courses with their own groups")
    .script({
      suppose: [
        fact(
          "there are two courses, each with their own group sets",
          async (context) => {
            // First course
            await context.withCourse(
              testTeacher(1),
              testCourse(1).withStudents(testStudents(2)),
            )
            const course1 = await context.getCourseValue(
              testTeacher(1),
              testCourse(1),
            )

            const group1: Group = {
              members: new Set([course1.students[0], course1.students[1]]),
            }

            await context.createGroupSet({
              name: "Course 1 Group Set",
              courseId: course1.id,
              createdAt: DateTime.fromISO("2025-03-01T12:00:00.000+00:00"),
              groups: [group1],
            })

            // Second course
            await context.withCourse(
              testTeacher(1),
              testCourse(2).withStudents(testStudents(2, { startingIndex: 3 })),
            )
            const course2 = await context.getCourseValue(
              testTeacher(1),
              testCourse(2),
            )

            const group2: Group = {
              members: new Set([course2.students[0], course2.students[1]]),
            }

            await context.createGroupSet({
              name: "Course 2 Group Set",
              courseId: course2.id,
              createdAt: DateTime.fromISO("2025-03-01T12:00:00.000+00:00"),
              groups: [group2],
            })
          },
        ),
      ],
      observe: [
        effect(
          "it gets only the groups for the specified course",
          async (context) => {
            const course1Groups = await context.getGroupsForCourse(
              testCourse(1),
            )
            expect(course1Groups.length, is(equalTo(1)))
            expect(
              course1Groups[0],
              is(groupWithMembers([studentName(1), studentName(2)])),
            )

            const course2Groups = await context.getGroupsForCourse(
              testCourse(2),
            )
            expect(course2Groups.length, is(equalTo(1)))
            expect(
              course2Groups[0],
              is(groupWithMembers([studentName(3), studentName(4)])),
            )
          },
        ),
      ],
    }),
])
