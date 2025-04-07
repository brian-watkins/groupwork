import { behavior, effect, example, fact } from "best-behavior"
import { expect, is, equalTo, objectWithProperty } from "great-expectations"
import { testableGroupWorkDomain } from "./helpers/testableGroupWork"
import { testCourse } from "./helpers/testCourse"
import { testTeacher } from "../app/helpers/testTeacher"
import { errorResultWith, okResultWith } from "./helpers/matchers"
import { testGroup } from "./helpers/testGroup"
import { testStudent } from "./helpers/testStudent"
import { GroupSetError } from "@/domain/createGroupSet"

export default behavior("creating group sets", [

  example(testableGroupWorkDomain)
    .description("when a teacher who owns the course creates a group set")
    .script({
      suppose: [
        fact("there is a course owned by the teacher", (context) => {
          context
            .withCourse(testTeacher(1), testCourse(1))
        })
      ],
      observe: [
        effect("the group set is created successfully", async (context) => {
          const result = await context.createGroupSet(testTeacher(1), {
            name: "Project Teams",
            courseId: testCourse(1).id,
            groups: [testGroup(testStudent(1), testStudent(2))]
          })

          expect(result, is(okResultWith(objectWithProperty("name", equalTo("Project Teams")))))
        })
      ]
    }),

  example(testableGroupWorkDomain)
    .description("when a teacher who does not own the course attempts to create a group set")
    .script({
      suppose: [
        fact("there is a course owned by another teacher", (context) => {
          context.withCourse(testTeacher(1), testCourse(1))
        })
      ],
      observe: [
        effect("an Unauthorized error is returned", async (context) => {
          const result = await context.createGroupSet(testTeacher(2), {
            name: "Project Teams",
            courseId: "course-1",
            groups: []
          })

          expect(result, is(errorResultWith(equalTo(GroupSetError.Unauthorized))))
        })
      ]
    })

])