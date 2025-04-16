import { behavior, effect, example, fact, step } from "best-behavior"
import { testCourse } from "./helpers/testCourse"
import { testStudents } from "./helpers/testStudent"
import { testableGroupWorkDomain } from "./helpers/testableGroupWork"
import {
  arrayWith,
  equalTo,
  expect,
  is,
  objectWithProperty,
} from "great-expectations"
import {
  errorResultWith,
  groupSetWithStudents,
  okResultWith,
  setWithSize,
  students,
} from "./helpers/matchers"
import { testTeacher } from "../app/helpers/testTeacher"
import { AssignGroupsError } from "@/domain/assignGroups"

export default behavior("choosing with no history", [
  example(testableGroupWorkDomain)
    .description("unauthorized access to course groups")
    .script({
      suppose: [
        fact("there is a course for a teacher", (context) => {
          context.withCourse(
            testTeacher(1),
            testCourse(1).withStudents(testStudents(4)),
          )
        }),
      ],
      perform: [
        step(
          "an unauthorized teacher tries to assign groups",
          async (context) => {
            await context.chooseGroupsOf(testTeacher(2), 2)
          },
        ),
      ],
      observe: [
        effect("the result is an error", (context) => {
          expect(
            context.getCurrentGroups(),
            is(errorResultWith(equalTo(AssignGroupsError.Unauthorized))),
          )
        }),
      ],
    }),

  example(testableGroupWorkDomain)
    .description("choose groups of 2 from even set of students")
    .script({
      suppose: [
        fact(
          "there are four members of a class that have not been in any groups",
          (context) => {
            context.withCourse(
              testTeacher(1),
              testCourse(1).withStudents(testStudents(4)),
            )
          },
        ),
      ],
      perform: [
        step("choose groups of 2", async (context) => {
          await context.chooseGroupsOf(testTeacher(1), 2)
        }),
      ],
      observe: [
        effect("two groups are generated", (context) => {
          expect(
            context.getCurrentGroups().map((groups) => groups.length),
            is(okResultWith(equalTo(2))),
          )
        }),
        effect("the two groups are distinct", async (context) => {
          expect(
            context.getCurrentGroups(),
            is(okResultWith(groupSetWithStudents(students(4)))),
          )
        }),
      ],
    }),

  example(testableGroupWorkDomain)
    .description("choose groups of 2 from odd set of students")
    .script({
      suppose: [
        fact(
          "there are five members of a class that have not been in any groups",
          (context) => {
            context.withCourse(
              testTeacher(1),
              testCourse(1).withStudents(testStudents(5)),
            )
          },
        ),
      ],
      perform: [
        step("choose groups of 2", async (context) => {
          await context.chooseGroupsOf(testTeacher(1), 2)
        }),
      ],
      observe: [
        effect("two groups are generated, one with three", (context) => {
          expect(
            context.getCurrentGroups(),
            is(
              okResultWith(
                arrayWith(
                  [
                    objectWithProperty("members", setWithSize(2)),
                    objectWithProperty("members", setWithSize(3)),
                  ],
                  { withAnyOrder: true },
                ),
              ),
            ),
          )
        }),
        effect("the two groups are distinct", async (context) => {
          expect(
            context.getCurrentGroups(),
            is(okResultWith(groupSetWithStudents(students(5)))),
          )
        }),
      ],
    }),

  example(testableGroupWorkDomain)
    .description("choose groups of 3 from set of 11 students")
    .script({
      suppose: [
        fact(
          "there are 11 members of a class that have not been in any groups",
          (context) => {
            context.withCourse(
              testTeacher(1),
              testCourse(1).withStudents(testStudents(11)),
            )
          },
        ),
      ],
      perform: [
        step("choose groups of 3", async (context) => {
          await context.chooseGroupsOf(testTeacher(1), 3)
        }),
      ],
      observe: [
        effect("4 groups are generated, one with two", (context) => {
          expect(
            context.getCurrentGroups(),
            is(
              okResultWith(
                arrayWith(
                  [
                    objectWithProperty("members", setWithSize(2)),
                    objectWithProperty("members", setWithSize(3)),
                    objectWithProperty("members", setWithSize(3)),
                    objectWithProperty("members", setWithSize(3)),
                  ],
                  { withAnyOrder: true },
                ),
              ),
            ),
          )
        }),
        effect("all the students are included once", async (context) => {
          expect(
            context.getCurrentGroups(),
            is(okResultWith(groupSetWithStudents(students(11)))),
          )
        }),
      ],
    }),
])
