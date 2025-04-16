import { behavior, example, fact, effect } from "best-behavior"
import { expect, is, equalTo, objectWithProperty } from "great-expectations"
import { UpdateGroupSetError } from "@/domain/saveGroupSet"
import { testCourse } from "./helpers/testCourse"
import { errorResultWith, okResultWith } from "./helpers/matchers"
import { testTeacher } from "../app/helpers/testTeacher"
import { testableGroupWorkDomain } from "./helpers/testableGroupWork"
import { testGroupSet } from "../component/helpers/testGroupSet"

export default behavior("update group set", [
  example(testableGroupWorkDomain)
    .description("when the teacher is not authorized to manage the course")
    .script({
      suppose: [
        fact("a teacher is authorized to manage the course", (context) => {
          context.withCourse(testTeacher(1), testCourse(1))
        }),
      ],
      observe: [
        effect(
          "attempt to update the group set by another teacher results in an error",
          async (context) => {
            const result = await context.updateGroupSet(
              testTeacher(2),
              testGroupSet(1).withCourse(testCourse(1)),
            )
            expect(
              result,
              is(errorResultWith(equalTo(UpdateGroupSetError.Unauthorized))),
            )
          },
        ),
      ],
    }),

  example(testableGroupWorkDomain)
    .description("when the teacher is authorized to manage the course")
    .script({
      suppose: [
        fact("a teacher is authorized to manage the course", (context) => {
          context.withCourse(testTeacher(1), testCourse(1))
        }),
      ],
      observe: [
        effect(
          "attempt to update the group set is successful",
          async (context) => {
            const result = await context.updateGroupSet(
              testTeacher(1),
              testGroupSet(1).withCourse(testCourse(1)),
            )
            expect(
              result,
              is(
                okResultWith(
                  objectWithProperty("id", equalTo(testGroupSet(1).id)),
                ),
              ),
            )
          },
        ),
      ],
    }),
])
