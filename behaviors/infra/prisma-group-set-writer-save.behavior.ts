import { behavior, example, effect, fact, step } from "best-behavior";
import { expect, is, equalTo, objectWith, arrayWith, objectWithProperty, setWith } from "great-expectations";
import { testCourse } from "../domain/helpers/testCourse";
import { testStudents } from "../domain/helpers/testStudent";
import { testableDatabase } from "./helpers/testableDatabase";
import { testTeacher } from "../app/helpers/testTeacher";
import { testGroup } from "../domain/helpers/testGroup";
import { Group } from "@/domain/group";

export default behavior("PrismaGroupSetWriter #save", [
  
  example(testableDatabase)
    .description("save updates an existing group set's name")
    .script({
      suppose: [
        fact("there is an existing group set in the database", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(6)))
          const course = await context.getCourseValue(testTeacher(1), testCourse(1))

          await context.createGroupSet({
            courseId: course.id,
            name: "Fun Group",
            groups: [
              testGroup(course.students[0], course.students[1], course.students[2]),
              testGroup(course.students[3], course.students[4], course.students[5])
            ]
          })
        })
      ],
      perform: [
        step("save the updated group set", async (context) => {
          const course = await context.getCourseValue(testTeacher(1), testCourse(1))
          const groupSets = await context.getGroupSetsForCourse(testCourse(1))
          
          groupSets[0].name = "Updated Group Set"
          groupSets[0].groups[0] = testGroup(course.students[3], course.students[1], course.students[4])
          groupSets[0].groups[1] = testGroup(course.students[0], course.students[2], course.students[5])

          await context.updateGroupSet(groupSets[0])
        })
      ],
      observe: [
        effect("the group set name and groups are updated in the database", async (context) => {
          const course = await context.getCourseValue(testTeacher(1), testCourse(1))
          const groupSets = await context.getGroupSetsForCourse(testCourse(1))
          expect(groupSets[0], is(objectWith({
            name: equalTo("Updated Group Set"),
            groups: arrayWith<Group>([
              objectWithProperty("members", setWith([
                objectWithProperty("id", equalTo(course.students[3].id)),
                objectWithProperty("id", equalTo(course.students[1].id)),
                objectWithProperty("id", equalTo(course.students[4].id)),
              ])),
              objectWithProperty("members", setWith([
                objectWithProperty("id", equalTo(course.students[0].id)),
                objectWithProperty("id", equalTo(course.students[2].id)),
                objectWithProperty("id", equalTo(course.students[5].id)),
              ])),
            ], { withAnyOrder: true })
          })))
        })
      ]
    })
]);