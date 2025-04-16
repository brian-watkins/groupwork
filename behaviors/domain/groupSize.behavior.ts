import { behavior, effect, example, fact } from "best-behavior"
import { testCourse } from "./helpers/testCourse"
import { testStudents } from "./helpers/testStudent"
import { testableGroupWorkDomain } from "./helpers/testableGroupWork"
import {
  expect,
  objectWithProperty,
  rejectsWith,
  stringContaining,
} from "great-expectations"
import { testTeacher } from "../app/helpers/testTeacher"

export default behavior("validating group size", [
  example(testableGroupWorkDomain)
    .description("validate group size constraints")
    .script({
      suppose: [
        fact("there are 10 members of a class", (context) => {
          context.withCourse(
            testTeacher(1),
            testCourse(1).withStudents(testStudents(10)),
          )
        }),
      ],
      observe: [
        effect(
          "choosing with a group size of 1 throws an error",
          async (context) => {
            await expect(
              context.chooseGroupsOf(testTeacher(1), 1),
              rejectsWith(
                objectWithProperty(
                  "message",
                  stringContaining("Invalid group size"),
                ),
              ),
            )
          },
        ),
        effect(
          "choosing with a group size greater than half the students throws an error",
          async (context) => {
            await expect(
              context.chooseGroupsOf(testTeacher(1), 6),
              rejectsWith(
                objectWithProperty(
                  "message",
                  stringContaining("Invalid group size"),
                ),
              ),
            )
          },
        ),
      ],
    }),
])
