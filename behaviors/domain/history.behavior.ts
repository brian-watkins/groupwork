import { behavior, effect, example, fact, step } from "best-behavior";
import { testableGroupWorkDomain } from "./helpers/testableGroupWork";
import { testCourse } from "./helpers/testCourse";
import { testStudent, testStudents } from "./helpers/testStudent";
import { testGroup } from "./helpers/testGroup";
import { arrayWith, arrayWithLength, expect, is, Matcher, valueWhere } from "great-expectations";
import { Student } from "../../src/domain/student";
import { Group } from "../../src/domain/group";
import { allStudentsIn, students } from "./helpers/helpers";

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
          expect(groupWith(context.getCurrentGroups(), testStudent(1))!,
            is(groupWithOneOf([testStudent(3), testStudent(4)]))
          )
        }),
        effect("student 3 is not paired with student 4", (context) => {
          expect(groupWith(context.getCurrentGroups(), testStudent(3))!,
            is(groupWithOneOf([testStudent(1), testStudent(2)]))
          )
        }),
        effect("all the students are grouped", (context) => {
          expect(allStudentsIn(context.getCurrentGroups()), is(
            arrayWith(students(4), { withAnyOrder: true }))
          )
        })
      ]
    })

])

function groupWith(groups: Array<Group>, student: Student): Group | undefined {
  return groups
    .find(group => Array.from(group.members)
      .map(g => g.id)
      .includes(testStudent(1).id)
    )
}

function groupWithOneOf(students: Array<Student>): Matcher<Group> {
  return valueWhere((group) => {
    const members = Array.from(group.members)
    for (let i = 0; i < students.length; i++) {
      const hasIt = members.map(member => member.id).includes(students[i].id)
      if (hasIt) return true
    }
    return false
  }, `a group with one of ${students.map(s => s.id).join(", ")}`)
}