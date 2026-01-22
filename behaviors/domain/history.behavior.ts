import { behavior, effect, example, fact, step } from "best-behavior"
import { testableGroupWorkDomain } from "./helpers/testableGroupWork"
import { testCourse } from "./helpers/testCourse"
import { testStudent, testStudents } from "./helpers/testStudent"
import { testGroup } from "./helpers/testGroup"
import {
  arrayContaining,
  arrayWith,
  arrayWithLength,
  equalTo,
  expect,
  is,
  mapContaining,
  mapWith,
  objectWithProperty,
  setContaining,
  setWith,
  setWithSize,
} from "great-expectations"
import {
  groupSetWithGroupSatisfying,
  groupSetWithStudents,
  okResultWith,
  student,
  students,
} from "./helpers/matchers"
import { workedTogetherAlready, previousCollaborators } from "@/domain/group"
import { testTeacher } from "../app/helpers/testTeacher"

export default behavior("choosing groups based on history", [
  example(testableGroupWorkDomain)
    .description("groups of 2 from course with 4 students")
    .script({
      suppose: [
        fact(
          "there are four members of a class that have been in some groups",
          (context) => {
            context
              .withCourse(
                testTeacher(1),
                testCourse(1).withStudents(testStudents(4)),
              )
              .withGroups([
                testGroup(testStudent(1), testStudent(2)),
                testGroup(testStudent(3), testStudent(4)),
              ])
          },
        ),
      ],
      perform: [
        step("choose groups of 2", async (context) => {
          await context.chooseGroupsOf(testTeacher(1), 2)
        }),
      ],
      observe: [
        effect("there are two groups", (context) => {
          expect(
            context.getCurrentGroups().map((groups) => groups.length),
            is(okResultWith(equalTo(2))),
          )
        }),
        effect("student 1 is not paired with student 2", (context) => {
          expect(
            context.getCurrentGroups(),
            is(
              okResultWith(
                groupSetWithGroupSatisfying([
                  setContaining(student(1)),
                  setContaining(student(2), { times: 0 }),
                ]),
              ),
            ),
          )
        }),
        effect("student 3 is not paired with student 4", (context) => {
          expect(
            context.getCurrentGroups(),
            is(
              okResultWith(
                groupSetWithGroupSatisfying([
                  setContaining(student(3)),
                  setContaining(student(4), { times: 0 }),
                ]),
              ),
            ),
          )
        }),
        effect("all the students are grouped", (context) => {
          expect(
            context.getCurrentGroups(),
            is(okResultWith(groupSetWithStudents(students(4)))),
          )
        }),
      ],
    }),

  example(testableGroupWorkDomain)
    .description("some students are chosen who have already partnered")
    .script({
      suppose: [
        fact(
          "there are four members of a class that have been in some groups",
          (context) => {
            context
              .withCourse(
                testTeacher(1),
                testCourse(1).withStudents(testStudents(4)),
              )
              .withGroups([
                testGroup(testStudent(1), testStudent(2)),
                testGroup(testStudent(3), testStudent(4)),
                testGroup(testStudent(1), testStudent(3)),
                testGroup(testStudent(2), testStudent(3)),
              ])
          },
        ),
      ],
      perform: [
        step("choose new groups of 2", async (context) => {
          await context.chooseGroupsOf(testTeacher(1), 2)
        }),
      ],
      observe: [
        effect("there are two groups", (context) => {
          expect(
            context.getCurrentGroups(),
            is(okResultWith(arrayWithLength(2))),
          )
          expect(
            context.getCurrentGroups(),
            is(
              okResultWith(
                arrayWith([
                  objectWithProperty("members", setWithSize(2)),
                  objectWithProperty("members", setWithSize(2)),
                ]),
              ),
            ),
          )
        }),
        effect("all the students are grouped", (context) => {
          expect(
            context.getCurrentGroups(),
            is(okResultWith(groupSetWithStudents(students(4)))),
          )
        }),
        effect(
          "two of the students have a previous collaborator -- each other",
          (context) => {
            const groups = context.getCurrentGroups().valueOr(() => [])

            expect(
              groups.map((group) =>
                Array.from(context.getCurrentCollaborators(group).values()),
              ),
              is(
                arrayContaining(
                  arrayContaining(arrayWithLength(1), { times: 2 }),
                  { times: 1 },
                ),
              ),
            )
          },
        ),
      ],
    }),

  example()
    .description("workedTogetherAlready")
    .script({
      observe: [
        effect("when students have worked together", () => {
          const groups = [
            testGroup(testStudent(1), testStudent(2), testStudent(4)),
            testGroup(testStudent(1), testStudent(3), testStudent(4)),
          ]

          const current = testGroup(
            testStudent(1),
            testStudent(2),
            testStudent(3),
          )

          const collaborationMap = workedTogetherAlready(groups, current)

          expect(
            collaborationMap,
            is(
              mapWith([
                {
                  key: equalTo(testStudent(1).id),
                  value: arrayWith([student(2), student(3)], {
                    withAnyOrder: true,
                  }),
                },
                {
                  key: equalTo(testStudent(2).id),
                  value: arrayWith([student(1)]),
                },
                {
                  key: equalTo(testStudent(3).id),
                  value: arrayWith([student(1)]),
                },
              ]),
            ),
          )
        }),
        effect("when no one has worked together", () => {
          const groups = [
            testGroup(testStudent(1), testStudent(2)),
            testGroup(testStudent(3), testStudent(4)),
            testGroup(testStudent(1), testStudent(3)),
            testGroup(testStudent(2), testStudent(3)),
          ]
          const current = testGroup(testStudent(1), testStudent(4))
          const collaborationMap = workedTogetherAlready(groups, current)

          expect(
            collaborationMap,
            is(
              mapWith([
                {
                  key: equalTo(testStudent(1).id),
                  value: arrayWithLength(0),
                },
                {
                  key: equalTo(testStudent(4).id),
                  value: arrayWithLength(0),
                },
              ]),
            ),
          )
        }),
      ],
    }),

  example()
    .description("previousCollaborators")
    .script({
      observe: [
        effect("returns all students who worked with the given student", () => {
          const groups = [
            testGroup(testStudent(1), testStudent(2), testStudent(3)),
            testGroup(testStudent(1), testStudent(4)),
            testGroup(testStudent(2), testStudent(5)),
          ]

          const collaborators = previousCollaborators(groups, testStudent(1))

          expect(
            collaborators,
            is(
              setWith([
                equalTo(testStudent(2).id),
                equalTo(testStudent(3).id),
                equalTo(testStudent(4).id),
              ]),
            ),
          )
        }),
        effect("returns empty set when student has no history", () => {
          const groups = [
            testGroup(testStudent(1), testStudent(2)),
            testGroup(testStudent(3), testStudent(4)),
          ]

          const collaborators = previousCollaborators(groups, testStudent(5))

          expect(collaborators, is(setWithSize(0)))
        }),
        effect("does not include the student themselves", () => {
          const groups = [
            testGroup(testStudent(1), testStudent(2), testStudent(3)),
          ]

          const collaborators = previousCollaborators(groups, testStudent(1))

          expect(
            collaborators,
            is(
              setWith([equalTo(testStudent(2).id), equalTo(testStudent(3).id)]),
            ),
          )
        }),
        effect("handles multiple group sets with the same student", () => {
          const groups = [
            testGroup(testStudent(1), testStudent(2)),
            testGroup(testStudent(1), testStudent(2), testStudent(3)),
            testGroup(testStudent(1), testStudent(4)),
          ]

          const collaborators = previousCollaborators(groups, testStudent(1))

          expect(
            collaborators,
            is(
              setWith([
                equalTo(testStudent(2).id),
                equalTo(testStudent(3).id),
                equalTo(testStudent(4).id),
              ]),
            ),
          )
        }),
      ],
    }),
])
