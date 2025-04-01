import { behavior, example, effect, fact, step } from "best-behavior";
import { expect, is, equalTo, arrayWith, objectWith, arrayContaining, objectWithProperty, setWithSize } from "great-expectations";
import { DateTime } from "luxon";
import { Group } from "../../src/domain/group";
import { testableDatabase } from "./helpers/testableDatabase";
import { testCourse } from "./helpers/testCourse";
import { testStudents } from "./helpers/testStudent";

export default behavior("Persisting GroupSets", [

  example(testableDatabase)
    .description("writes and reads a group set")
    .script({
      suppose: [
        fact("there is a course with students", async (context) => {
          await context.withCourse(testCourse(1).withStudents(testStudents(4)))
        })
      ],
      perform: [
        step("a group set is created and written to the database", async (context) => {
          const course = await context.getCourse(testCourse(1))

          const group1: Group = {
            members: new Set([course.students[0], course.students[1]])
          }

          const group2: Group = {
            members: new Set([course.students[2], course.students[3]])
          }

          await context.createGroupSet({
            name: "Fun Set of Groups",
            course,
            createdAt: DateTime.fromISO("2025-04-01T12:12:33.123+06:00"),
            groups: [group1, group2]
          })
        })
      ],
      observe: [
        effect("the group set can be found by course ID", async (context) => {
          const groupSets = await context.getGroupSetsForCourse(testCourse(1))

          expect(groupSets, is(arrayWith([
            objectWith({
              name: equalTo("Fun Set of Groups"),
              createdAt: equalTo(DateTime.fromISO("2025-04-01T12:12:33.123+06:00")),
              groups: arrayContaining<Group>(objectWithProperty("members", setWithSize(2)), { times: 2 })
            })
          ])))
        })
      ]
    })

])