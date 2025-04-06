import { behavior, example, effect, step, fact } from "best-behavior";
import { expect, is, equalTo, arrayWith, objectWith, resolvesTo, objectWithProperty } from "great-expectations";
import { testableDatabase } from "./helpers/testableDatabase";
import { Course } from "../../src/domain/course";
import { Student } from "@/domain/student";
import { studentName } from "../domain/helpers/matchers";
import { testStudent, testStudents } from "../domain/helpers/testStudent";
import { testCourse } from "../domain/helpers/testCourse";

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
    }),

  example(testableDatabase)
    .description("updates an existing course")
    .script({
      suppose: [
        fact("there is a saved course", async (context) => {
          await context.withCourse(testCourse(1).withStudents(testStudents(4)))
        })
      ],
      perform: [
        step("update the course by changing its name and modifying students", async (context) => {
          const courseToUpdate = await context.getCourse(testCourse(1))

          // Update the course name
          courseToUpdate.name = "Updated Course Name";

          // Remove the second and fourth students
          courseToUpdate.students = courseToUpdate.students.filter(
            (student) => student.name !== testStudent(3).name
          ).filter(
            (student) => student.name !== testStudent(4).name
          )

          // Add a new student
          courseToUpdate.students.push({
            id: "", // New student has no ID yet
            name: "New Student"
          });

          // Save the updated course
          await context.saveCourse(courseToUpdate);
        })
      ],
      observe: [
        effect("the updated course exists in the database with correct details", async (context) => {
          // Note that the id of the course is still saved in the test helper by the testCourse(1).name
          const updatedCourse = await context.getCourse(testCourse(1));

          expect(updatedCourse.name, is(equalTo("Updated Course Name")));

          expect(updatedCourse.students, is(arrayWith([
            studentName(1),
            studentName(2),
            objectWithProperty("name", equalTo("New Student"))
          ], { withAnyOrder: true })));
        })
      ]
    }),

  example(testableDatabase)
    .description("updates only course name without modifying students")
    .script({
      suppose: [
        fact("there is a saved course", async (context) => {
          await context.withCourse(testCourse(4).withStudents(testStudents(4)))
        })
      ],
      perform: [
        step("update only the course name", async (context) => {
          const courseToUpdate = await context.getCourse(testCourse(4));

          // Update just the course name
          courseToUpdate.name = "Only Name Updated";

          // Save the updated course
          await context.saveCourse(courseToUpdate);
        })
      ],
      observe: [
        effect("the course name is updated but students remain unchanged", async (context) => {
          await expect(context.getAllCourses(), resolvesTo(arrayWith([
            objectWith({
              name: equalTo("Only Name Updated"),
              students: arrayWith<Student>([
                studentName(1),
                studentName(2),
                studentName(3),
                studentName(4),
              ], { withAnyOrder: true })
            })
          ])))
        })
      ]
    })
]);
