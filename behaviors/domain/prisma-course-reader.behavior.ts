import { behavior, example, effect, fact } from "best-behavior";
import { expect, is, equalTo, arrayWith, objectWith, resolvesTo } from "great-expectations";
import { testableDatabase } from "./helpers/testableDatabase";
import { testCourse } from "./helpers/testCourse";
import { testStudents } from "./helpers/testStudent";
import { Course } from "../../src/domain/course";
import { Student } from "@/domain/student";
import { studentName } from "./helpers/matchers";

export default behavior("PrismaCourseReader", [
  example(testableDatabase)
    .description("reads a course with its students")
    .script({
      suppose: [
        fact("there is a course with students", async (context) => {
          await context.withCourse(testCourse(1).withStudents(testStudents(2)))
        })
      ],
      observe: [
        effect("it gets the course with the correct details", async (context) => {
          await expect(context.getCourse(testCourse(1)), resolvesTo(objectWith({
            name: equalTo("Course #1"),
            students: arrayWith<Student>([
              studentName(1),
              studentName(2)
            ])
          })))
        })
      ]
    }),

  example(testableDatabase)
    .description("reads all courses")
    .script({
      suppose: [
        fact("there are multiple courses with students", async (context) => {
          await context.withCourse(testCourse(1).withStudents(testStudents(2)))
          await context.withCourse(testCourse(2).withStudents(testStudents(3, { startingIndex: 3 })))
        })
      ],
      observe: [
        effect("it gets a list of all courses with their students", async (context) => {
          const courses = await context.getAllCourses()

          expect(courses, is(arrayWith<Course>([
            objectWith({
              name: equalTo(testCourse(1).name),
              students: arrayWith<Student>([
                studentName(1),
                studentName(2),
              ])
            }),
            objectWith({
              name: equalTo(testCourse(2).name),
              students: arrayWith<Student>([
                studentName(3),
                studentName(4),
                studentName(5),
              ])
            })
          ])))
        })
      ]
    })
]);