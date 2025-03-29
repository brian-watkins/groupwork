import { behavior, effect, example, fact, step } from "best-behavior"
import { testCourse } from "./helpers/testCourse"
import { testStudents } from "./helpers/testStudent"
import { testableGroupWorkDomain } from "./helpers/testableGroupWork"
import { arrayWith, expect, is, objectWithProperty } from "great-expectations"
import { allStudentsIn, setWithSize, students } from "./helpers/helpers"

export default behavior("choosing with no history", [

  example(testableGroupWorkDomain)
    .description("choose groups of 2 from even set of students")
    .script({
      suppose: [
        fact("there are four members of a class that have not been in any groups", (context) => {
          context.withCourse(testCourse(1).withStudents(testStudents(4)))
        })
      ],
      perform: [
        step("choose groups of 2", async (context) => {
          await context.chooseGroupsOf(2)
        }),
      ],
      observe: [
        effect("two groups are generated", (context) => {
          expect(context.getCurrentGroups().length, is(2))
        }),
        effect("the two groups are distinct", async (context) => {
          expect(allStudentsIn(context.getCurrentGroups()), is(
            arrayWith(students(4), { withAnyOrder: true }))
          )
        })
      ]
    }),

  example(testableGroupWorkDomain)
    .description("choose groups of 2 from odd set of students")
    .script({
      suppose: [
        fact("there are five members of a class that have not been in any groups", (context) => {
          context.withCourse(testCourse(1).withStudents(testStudents(5)))
        })
      ],
      perform: [
        step("choose groups of 2", async (context) => {
          await context.chooseGroupsOf(2)
        }),
      ],
      observe: [
        effect("two groups are generated, one with three", (context) => {
          expect(context.getCurrentGroups(), is(arrayWith([
            objectWithProperty("members", setWithSize(2)),
            objectWithProperty("members", setWithSize(3))
          ], { withAnyOrder: true })))
        }),
        effect("the two groups are distinct", async (context) => {
          expect(allStudentsIn(context.getCurrentGroups()), is(arrayWith(
            students(5), { withAnyOrder: true }))
          )
        })
      ]
    }),

  example(testableGroupWorkDomain)
    .description("choose groups of 3 from set of 11 students")
    .script({
      suppose: [
        fact("there are 11 members of a class that have not been in any groups", (context) => {
          context.withCourse(testCourse(1).withStudents(testStudents(11)))
        })
      ],
      perform: [
        step("choose groups of 3", async (context) => {
          await context.chooseGroupsOf(3)
        }),
      ],
      observe: [
        effect("4 groups are generated, one with two", (context) => {
          expect(context.getCurrentGroups(), is(arrayWith([
            objectWithProperty("members", setWithSize(2)),
            objectWithProperty("members", setWithSize(3)),
            objectWithProperty("members", setWithSize(3)),
            objectWithProperty("members", setWithSize(3))
          ], { withAnyOrder: true })))
        }),
        effect("all the students are included once", async (context) => {
          expect(allStudentsIn(context.getCurrentGroups()), is(
            arrayWith(students(11), { withAnyOrder: true }))
          )
        })
      ]
    }),

])

