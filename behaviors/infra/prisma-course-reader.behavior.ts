import { behavior, example, effect, fact } from "best-behavior";
import { expect, is, equalTo, arrayWith, objectWith, resolvesTo, stringContaining, rejectsWith } from "great-expectations";
import { testableDatabase } from "./helpers/testableDatabase";
import { testCourse } from "../domain/helpers/testCourse";
import { testStudents } from "../domain/helpers/testStudent";
import { Course } from "../../src/domain/course";
import { Student } from "@/domain/student";
import { errorResultWith, okResultWith, studentName } from "../domain/helpers/matchers";
import { testTeacher } from "../app/helpers/testTeacher";
import { errorWithMessage } from "./helpers/matchers";
import { CourseReaderError } from "@/domain/courseReader";

export default behavior("PrismaCourseReader", [
  example(testableDatabase)
    .description("reads a course with its students")
    .script({
      suppose: [
        fact("there is a course with students", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(2)))
        })
      ],
      observe: [
        effect("it gets the course with the correct details", async (context) => {
          await expect(context.getCourse(testTeacher(1), testCourse(1)), resolvesTo(okResultWith(objectWith({
            name: equalTo("Course #1"),
            students: arrayWith<Student>([
              studentName(1),
              studentName(2)
            ])
          }))))
        })
      ]
    }),

  example(testableDatabase)
    .description("reads all courses")
    .script({
      suppose: [
        fact("there are multiple courses with students", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(2)))
          await context.withCourse(testTeacher(1), testCourse(2).withStudents(testStudents(3, { startingIndex: 3 })))
        })
      ],
      observe: [
        effect("it gets a list of all courses with their students", async (context) => {
          const courses = await context.getAllCourses(testTeacher(1))

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
    }),

  example(testableDatabase)
    .description("prevents accessing courses created by another teacher")
    .script({
      suppose: [
        fact("there are courses created by different teachers", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(2)))
          await context.withCourse(testTeacher(2), testCourse(2).withStudents(testStudents(2, { startingIndex: 3 })))
        })
      ],
      observe: [
        effect("each teacher can only see their own courses", async (context) => {
          const teacher1Courses = await context.getAllCourses(testTeacher(1))
          expect(teacher1Courses, is(arrayWith([
            objectWith({
              name: equalTo(testCourse(1).name)
            })
          ])))

          const teacher2Courses = await context.getAllCourses(testTeacher(2))
          expect(teacher2Courses, is(arrayWith([
            objectWith({
              name: equalTo(testCourse(2).name)
            })
          ])))
        }),
        effect("a teacher cannot access a course created by another teacher", async (context) => {
          await expect(context.getCourse(testTeacher(1), testCourse(2)), resolvesTo(
            errorResultWith(equalTo(CourseReaderError.NotFound))
          ))
        })
      ]
    }),

  example(testableDatabase)
    .description("returns error when attempting to access a non-existent course")
    .script({
      suppose: [
        fact("there is a course with students", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(2)))
        })
      ],
      observe: [
        effect("it retuens an error when trying to access a non-existent course", async (context) => {
          await expect(context.getCourseById(testTeacher(1), "non-existent-id"), resolvesTo(
            errorResultWith(equalTo(CourseReaderError.NotFound))
          ))
        })
      ]
    })
]);