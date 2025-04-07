import { behavior, effect, example, fact, step } from "best-behavior";
import { testableGroupWorkDomain } from "./helpers/testableGroupWork";
import { testCourse } from "./helpers/testCourse";
import { testStudent, testStudents } from "./helpers/testStudent";
import { testGroup } from "./helpers/testGroup";
import { arrayContaining, arrayWith, arrayWithLength, equalTo, expect, is, objectWithProperty, setContaining, setWithSize } from "great-expectations";
import { groupSetWithGroupSatisfying, groupSetWithStudents, okResultWith, student, students } from "./helpers/matchers";
import { workedTogetherAlready } from "@/domain/group";
import { testTeacher } from "../app/helpers/testTeacher";

export default behavior("choosing groups based on history", [

  example(testableGroupWorkDomain)
    .description("groups of 2 from course with 4 students")
    .script({
      suppose: [
        fact("there are four members of a class that have been in some groups", (context) => {
          context
            .withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(4)))
            .withGroups([
              testGroup(testStudent(1), testStudent(2)),
              testGroup(testStudent(3), testStudent(4))
            ])
        })
      ],
      perform: [
        step("choose groups of 2", async (context) => {
          await context.chooseGroupsOf(testTeacher(1), 2)
        })
      ],
      observe: [
        effect("there are two groups", (context) => {
          expect(context.getCurrentGroups().map(groups => groups.length), is(okResultWith(equalTo(2))))
        }),
        effect("student 1 is not paired with student 2", (context) => {
          expect(context.getCurrentGroups(), is(okResultWith(groupSetWithGroupSatisfying([
            setContaining(student(1)),
            setContaining(student(2), { times: 0 })
          ]))))
        }),
        effect("student 3 is not paired with student 4", (context) => {
          expect(context.getCurrentGroups(), is(okResultWith(groupSetWithGroupSatisfying([
            setContaining(student(3)),
            setContaining(student(4), { times: 0 })
          ]))))
        }),
        effect("all the students are grouped", (context) => {
          expect(context.getCurrentGroups(), is(okResultWith(groupSetWithStudents(students(4)))))
        })
      ]
    }),

  example(testableGroupWorkDomain)
    .description("some students are chosen who have already partnered")
    .script({
      suppose: [
        fact("there are four members of a class that have been in some groups", (context) => {
          context
            .withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(4)))
            .withGroups([
              testGroup(testStudent(1), testStudent(2)),
              testGroup(testStudent(3), testStudent(4)),
              testGroup(testStudent(1), testStudent(3)),
              testGroup(testStudent(2), testStudent(3))
            ])
        })
      ],
      perform: [
        step("choose new groups of 2", async (context) => {
          await context.chooseGroupsOf(testTeacher(1), 2)
        })
      ],
      observe: [
        effect("there are two groups", (context) => {
          expect(context.getCurrentGroups(), is(okResultWith(arrayWithLength(2))))
          expect(context.getCurrentGroups(), is(okResultWith(arrayWith([
            objectWithProperty("members", setWithSize(2)),
            objectWithProperty("members", setWithSize(2))
          ]))))
        }),
        effect("all the students are grouped", (context) => {
          expect(context.getCurrentGroups(), is(okResultWith(groupSetWithStudents(students(4)))))
        }),
        effect("there is only one previous collaboration", (context) => {
          const groups = context.getCurrentGroups().valueOr(() => [])
          const group1Collaborators = context.getCurrentCollaborators(groups[0])
          const group2Collaborators = context.getCurrentCollaborators(groups[1])
          expect([
            group1Collaborators,
            group2Collaborators
          ], is(arrayContaining(
            arrayWithLength(1), { times: 1 }
          )))
        })
      ]
    }),

  example()
    .description("workedTogetherAlready")
    .script({
      observe: [
        effect("when students have worked together", () => {
          const groups = [
            testGroup(testStudent(1), testStudent(2), testStudent(4)),
            testGroup(testStudent(1), testStudent(3), testStudent(4))
          ]
          const current = testGroup(testStudent(1), testStudent(2), testStudent(3))
          const students = workedTogetherAlready(groups, current)
          expect(students, is(arrayWith([
            arrayWith([student(1), student(3)], { withAnyOrder: true }),
            arrayWith([student(1), student(2)], { withAnyOrder: true })
          ], { withAnyOrder: true })))
        }),
        effect("when no one has worked together", () => {
          const groups = [
            testGroup(testStudent(1), testStudent(2)),
            testGroup(testStudent(3), testStudent(4)),
            testGroup(testStudent(1), testStudent(3)),
            testGroup(testStudent(2), testStudent(3))
          ]
          const current = testGroup(testStudent(1), testStudent(4))
          const students = workedTogetherAlready(groups, current)
          expect(students, is(arrayWithLength(0)))
        })
      ]
    }),



])