import { behavior, example, effect, step } from "best-behavior";
import { expect, is, equalTo, arrayWith, objectWith, resolvesTo } from "great-expectations";
import { testableDatabase } from "./helpers/testableDatabase";
import { Course } from "../../src/domain/course";
import { Student } from "@/domain/student";
import { studentName } from "../domain/helpers/matchers";
import { PrismaCourseWriter } from "@/infrastructure/prismaCourseWriter";
import { CourseDetails } from "@/domain/courseWriter";
import { testStudent } from "../domain/helpers/testStudent";

export default behavior("PrismaCourseWriter", [
  example(testableDatabase)
    .description("writes a new course with students")
    .script({
      perform: [
        step("write a new course with students", async (context) => {
          await context.writeCourse({
            name: "New Test Course",
            students: [
              testStudent(1),
              testStudent(2),
              testStudent(3)
            ]
          })
        })
      ],
      observe: [
        effect("the course exists in the database with the correct details", async (context) => {
          const courses = await context.getAllCourses();

          expect(courses, is(arrayWith<Course>([
            objectWith({
              name: equalTo("New Test Course"),
              students: arrayWith<Student>([
                studentName(1),
                studentName(2),
                studentName(3)
              ])
            })
          ])))
        })
      ]
    }),

  example(testableDatabase)
    .description("writes a course without students")
    .script({
      perform: [
        step("write a new course without students", async (context) => {
          await context.writeCourse({
            name: "Empty Course",
            students: []
          })
        })
      ],
      observe: [
        effect("the course exists in the database with no students", async (context) => {
          const courses = await context.getAllCourses();

          expect(courses, is(arrayWith<Course>([
            objectWith({
              name: equalTo("Empty Course"),
              students: arrayWith<Student>([])
            })
          ])));
        })
      ]
    }),

  example(testableDatabase)
    .description("writes multiple courses")
    .script({
      perform: [
        step("write multiple courses", async (context) => {
          await context.writeCourse({
            name: "First Course",
            students: [
              testStudent(1),
              testStudent(2)
            ]
          })

          await context.writeCourse({
            name: "Second Course",
            students: [
              testStudent(3)
            ]
          })
        })
      ],
      observe: [
        effect("all courses exist in the database with correct details", async (context) => {
          await expect(context.getAllCourses(), resolvesTo(arrayWith([
            objectWith({
              name: equalTo("First Course"),
              students: arrayWith<Student>([
                studentName(1),
                studentName(2)
              ])
            }),
            objectWith({
              name: equalTo("Second Course"),
              students: arrayWith<Student>([
                studentName(3)
              ])
            })
          ], { withAnyOrder: true })))
        })
      ]
    })
]);
