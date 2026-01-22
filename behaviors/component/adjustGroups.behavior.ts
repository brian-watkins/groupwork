import { behavior, effect, example, fact, step } from "best-behavior"
import { testGroup } from "../domain/helpers/testGroup"
import { testStudents, testStudent } from "../domain/helpers/testStudent"
import { expect, is, equalTo, arrayWith, resolvesTo } from "great-expectations"
import { testableGroupList } from "./helpers/testableGroupList"
import { testGroupSet } from "./helpers/testGroupSet"

export default behavior("adjusting groups", [
  example(testableGroupList)
    .description(
      "shows the count and names of past collaborators for each student",
    )
    .script({
      suppose: [
        fact(
          "there are previous group sets with complex collaboration history",
          async (context) => {
            await context
              .withGroupSets([
                testGroupSet(1).withGroups([
                  testGroup(testStudent(1), testStudent(2), testStudent(3)),
                  testGroup(testStudent(4), testStudent(5), testStudent(6)),
                  testGroup(testStudent(7), testStudent(8), testStudent(9)),
                ]),
                testGroupSet(2).withGroups([
                  testGroup(testStudent(1), testStudent(4), testStudent(7)),
                  testGroup(testStudent(2), testStudent(5), testStudent(8)),
                  testGroup(testStudent(3), testStudent(6), testStudent(9)),
                ]),
              ])
              .withGroups([
                testGroup(testStudent(1), testStudent(2), testStudent(4)),
                testGroup(testStudent(3), testStudent(5), testStudent(7)),
                testGroup(testStudent(6), testStudent(8), testStudent(9)),
              ])
              .render()
          },
        ),
      ],
      observe: [
        effect(
          "students show the number of collaborators in their current group",
          async (context) => {
            await expect(
              context.display.group(0).member(0).partneredIndicator.text(),
              resolvesTo("2"),
            )
            await expect(
              context.display.group(0).member(1).partneredIndicator.text(),
              resolvesTo("1"),
            )
            await expect(
              context.display.group(0).member(2).partneredIndicator.text(),
              resolvesTo("1"),
            )

            await expect(
              context.display.group(2).member(0).partneredIndicator.text(),
              resolvesTo("1"),
            )
            await expect(
              context.display.group(2).member(1).partneredIndicator.text(),
              resolvesTo("1"),
            )
            await expect(
              context.display.group(2).member(2).partneredIndicator.text(),
              resolvesTo("2"),
            )
          },
        ),
        effect(
          "students who haven't worked with anyone in their group don't show a count",
          async (context) => {
            await expect(
              context.display.group(1).member(0).partneredIndicator.isHidden(),
              resolvesTo(true),
            )
            await expect(
              context.display.group(1).member(1).partneredIndicator.isHidden(),
              resolvesTo(true),
            )
            await expect(
              context.display.group(1).member(2).partneredIndicator.isHidden(),
              resolvesTo(true),
            )
          },
        ),
      ],
    })
    .andThen({
      perform: [
        step(
          "trigger the tooltip on a partnered indicator",
          async (context) => {
            await context.display.group(0).member(0).partneredIndicator.focus()
            await context.display.previousCollaborators.waitForVisible()
          },
        ),
      ],
      observe: [
        effect(
          "the names of students previously worked with are displayed",
          async (context) => {
            await expect(
              context.display.previousCollaborators.text(),
              resolvesTo("Worked with: Fun Student 2, Fun Student 4"),
            )
          },
        ),
      ],
    })
    .andThen({
      perform: [
        step("focus a different partnered indicator", async (context) => {
          await context.display.group(0).member(1).partneredIndicator.focus()
          await context.display.previousCollaborators.waitForVisible()
        }),
      ],
      observe: [
        effect("it shows the students worked with", async (context) => {
          await expect(
            context.display.previousCollaborators.text(),
            resolvesTo("Worked with: Fun Student 1"),
          )
        }),
      ],
    }),

  example(testableGroupList)
    .description("move one student to another group")
    .script({
      suppose: [
        fact("there are multiple groups with students", async (context) => {
          await context
            .withGroups([
              testGroup(...testStudents(3)),
              testGroup(testStudent(4), testStudent(5)),
            ])
            .render()
        }),
      ],
      perform: [
        step("drag one student to the other group", async (context) => {
          const studentToDrag = context.display.group(0).member(1)
          await studentToDrag.dragTo(context.display.group(1))
        }),
      ],
      observe: [
        effect("the second group has the dragged student", async (context) => {
          await expect(
            context.display.group(1).members.texts(),
            resolvesTo(
              arrayWith(
                [
                  equalTo(testStudent(2).name),
                  equalTo(testStudent(4).name),
                  equalTo(testStudent(5).name),
                ],
                { withAnyOrder: true },
              ),
            ),
          )
        }),
        effect(
          "the first group no longer has the dragged student",
          async (context) => {
            await expect(
              context.display.group(0).members.texts(),
              resolvesTo(
                arrayWith(
                  [equalTo(testStudent(1).name), equalTo(testStudent(3).name)],
                  { withAnyOrder: true },
                ),
              ),
            )
          },
        ),
      ],
    }),

  example(testableGroupList)
    .description("dragging is disabled when the group list is not editable")
    .script({
      suppose: [
        fact(
          "there are multiple groups with students and editing is disabled",
          async (context) => {
            await context
              .withGroups([
                testGroup(...testStudents(3)),
                testGroup(testStudent(4), testStudent(5)),
              ])
              .setEditable(false)
              .render()
          },
        ),
      ],
      perform: [
        step(
          "attempt to drag one student to the other group",
          async (context) => {
            const studentToDrag = context.display.group(0).member(1)
            await studentToDrag.dragTo(context.display.group(1))
          },
        ),
      ],
      observe: [
        effect(
          "the students remain in their original groups",
          async (context) => {
            const group1Students = await context.display
              .group(0)
              .members.texts()
            expect(
              group1Students,
              is(
                arrayWith(
                  [
                    equalTo(testStudent(1).name),
                    equalTo(testStudent(2).name),
                    equalTo(testStudent(3).name),
                  ],
                  { withAnyOrder: true },
                ),
              ),
            )

            const group2Students = await context.display
              .group(1)
              .members.texts()
            expect(
              group2Students,
              is(
                arrayWith(
                  [equalTo(testStudent(4).name), equalTo(testStudent(5).name)],
                  { withAnyOrder: true },
                ),
              ),
            )
          },
        ),
      ],
    }),

  example(testableGroupList)
    .description(
      "when dragging a student, groups with previous collaborators are darkened",
    )
    .script({
      suppose: [
        fact(
          "there are previous group sets where students have worked together",
          async (context) => {
            await context
              .withGroupSets([
                testGroupSet(1).withGroups([
                  testGroup(testStudent(1), testStudent(2)),
                  testGroup(testStudent(3), testStudent(4)),
                ]),
                testGroupSet(2).withGroups([
                  testGroup(testStudent(1), testStudent(3)),
                  testGroup(testStudent(2), testStudent(4)),
                ]),
              ])
              .withGroups([
                testGroup(testStudent(1), testStudent(5)),
                testGroup(testStudent(2), testStudent(6)),
                testGroup(testStudent(3), testStudent(7)),
                testGroup(testStudent(4), testStudent(8)),
              ])
              .render()
          },
        ),
      ],
      perform: [
        step("begin dragging student 1", async (context) => {
          await context.display.group(0).member(0).startDrag()
        }),
      ],
      observe: [
        effect(
          "groups containing previous collaborators are darkened",
          async (context) => {
            await expect(
              context.display.group(1).isDarkened(),
              resolvesTo(true),
            )
            await expect(
              context.display.group(2).isDarkened(),
              resolvesTo(true),
            )
          },
        ),
        effect(
          "groups without previous collaborators are not darkened",
          async (context) => {
            await expect(
              context.display.group(0).isDarkened(),
              resolvesTo(false),
            )
            await expect(
              context.display.group(3).isDarkened(),
              resolvesTo(false),
            )
          },
        ),
      ],
    }),
])
