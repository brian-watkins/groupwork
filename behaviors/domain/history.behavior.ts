import { behavior, effect, example, fact, step } from "best-behavior";
import { testableGroupWorkDomain } from "./helpers/testableGroupWork";
import { testCourse } from "./helpers/testCourse";
import { testStudent, testStudents } from "./helpers/testStudent";
import { testGroup } from "./helpers/testGroup";
import { arrayWithLength, expect, is, setContaining } from "great-expectations";
import { groupSetWithGroupSatisfying, groupSetWithStudents, student, students } from "./helpers/matchers";

export default behavior("choosing groups based on history", [

  example(testableGroupWorkDomain)
    .description("groups of 2 from course with 4 students")
    .script({
      suppose: [
        fact("there are four members of a class that have been in some groups", (context) => {
          context
            .withCourse(testCourse(1).withStudents(testStudents(4)))
            .withGroups([
              testGroup(testStudent(1), testStudent(2)),
              testGroup(testStudent(3), testStudent(4))
            ])
        })
      ],
      perform: [
        step("choose groups of 2", async (context) => {
          await context.chooseGroupsOf(2)
        })
      ],
      observe: [
        effect("there are two groups", (context) => {
          expect(context.getCurrentGroups(), is(arrayWithLength(2)))
        }),
        effect("student 1 is not paired with student 2", (context) => {
          expect(context.getCurrentGroups(), is(groupSetWithGroupSatisfying([
            setContaining(student(1)),
            setContaining(student(2), { times: 0 })
          ])))
        }),
        effect("student 3 is not paired with student 4", (context) => {
          expect(context.getCurrentGroups(), is(groupSetWithGroupSatisfying([
            setContaining(student(3)),
            setContaining(student(4), { times: 0 })
          ])))
        }),
        effect("all the students are grouped", (context) => {
          expect(context.getCurrentGroups(), is(groupSetWithStudents(students(4))))
        })
      ]
    })

])