import { behavior, example, fact, effect } from "best-behavior";
import { expect, is, equalTo } from "great-expectations";
import { testCourse } from "./helpers/testCourse";
import { errorResultWith, okResultWith } from "./helpers/matchers";
import { testTeacher } from "../app/helpers/testTeacher";
import { testableGroupWorkDomain } from "./helpers/testableGroupWork";
import { testGroupSet } from "../component/helpers/testGroupSet";
import { DeleteGroupSetError } from "@/domain/deleteGroupSet";

export default behavior("delete group set", [

  example(testableGroupWorkDomain)
    .description("when the teacher is not authorized to manage the course")
    .script({
      suppose: [
        fact("a teacher is authorized to manage the course", (context) => {
          context.withCourse(testTeacher(1), testCourse(1))
        })
      ],
      observe: [
        effect("attempt to delete the group set by another teacher results in an error", async (context) => {
          const result = await context.deleteGroupSet(testTeacher(2), testGroupSet(1))
          expect(result, is(errorResultWith(equalTo(DeleteGroupSetError.Unauthorized))))
        })
      ]
    }),

  example(testableGroupWorkDomain)
    .description("when the teacher is authorized to manage the course")
    .script({
      suppose: [
        fact("a teacher is authorized to manage the course", (context) => {
          context.withCourse(testTeacher(1), testCourse(1));
        })
      ],
      observe: [
        effect("attempt to delete the group set is successful", async (context) => {
          const result = await context.deleteGroupSet(testTeacher(1), testGroupSet(1))
          expect(result, is(okResultWith(equalTo(true))))
        })
      ]
    })
])
