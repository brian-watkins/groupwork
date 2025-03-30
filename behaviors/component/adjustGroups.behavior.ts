import { behavior, effect, example, fact, step } from "best-behavior";
import { testGroup } from "../domain/helpers/testGroup";
import { testStudents, testStudent } from "../domain/helpers/testStudent";
import { expect, is, equalTo, arrayWith } from "great-expectations";
import { testableGroupList } from "./helpers/testableGroupList";

export default behavior("adjusting groups", [

  example(testableGroupList)
    .description("move one student to another group")
    .script({
      suppose: [
        fact("there are multiple groups with students", async (context) => {
          await context.withGroups([
            testGroup(...testStudents(3)),
            testGroup(testStudent(4), testStudent(5))
          ])
            .render()          
        })
      ],
      perform: [
        step("drag one student to the other group", async (context) => {
          const studentToDrag = context.display.selectAll("[data-student-group]").atIndex(0)
            .selectAllDescendants("[data-group-member]").atIndex(1)

          await studentToDrag.dragTo(context.display.selectAll("[data-student-group]").atIndex(1))
        })
      ],
      observe: [
        effect("the second group has the dragged student", async (context) => {
          const group2Students = await context.display.selectAll("[data-student-group]").atIndex(1).selectAllDescendants("[data-student-name]").texts()
          expect(group2Students, is(arrayWith([
            equalTo(testStudent(2).name),
            equalTo(testStudent(4).name),
            equalTo(testStudent(5).name)
          ], { withAnyOrder: true })))
        }),
        effect("the first group no longer has the dragged student", async (context) => {
          const group1Students = await context.display.selectAll("[data-student-group]").atIndex(0).selectAllDescendants("[data-student-name]").texts()
          expect(group1Students, is(arrayWith([
            equalTo(testStudent(1).name),
            equalTo(testStudent(3).name)
          ], { withAnyOrder: true })))
        })
      ]
    })

])