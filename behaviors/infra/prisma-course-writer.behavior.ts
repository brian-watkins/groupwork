import { behavior, example, effect, step, fact } from "best-behavior";
import { expect, is, equalTo, arrayWith, objectWith, resolvesTo, objectWithProperty, stringContaining, rejectsWith } from "great-expectations";
import { testableDatabase } from "./helpers/testableDatabase";
import { Course } from "../../src/domain/course";
import { Student } from "@/domain/student";
import { studentName } from "../domain/helpers/matchers";
import { testStudent, testStudents } from "../domain/helpers/testStudent";
import { testCourse } from "../domain/helpers/testCourse";
import { testTeacher } from "../app/helpers/testTeacher";
import { errorWithMessage } from "./helpers/matchers";

export default behavior("PrismaCourseWriter", [
  example(testableDatabase)
    .description("writes a new course with students")
    .script({
      perform: [
        step("write a new course with students", async (context) => {
          await context.writeCourse(testTeacher(1), {
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
          const courses = await context.getAllCourses(testTeacher(1));

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
          await context.writeCourse(testTeacher(1), {
            name: "Empty Course",
            students: []
          })
        })
      ],
      observe: [
        effect("the course exists in the database with no students", async (context) => {
          const courses = await context.getAllCourses(testTeacher(1));

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
          await context.writeCourse(testTeacher(1), {
            name: "First Course",
            students: [
              testStudent(1),
              testStudent(2)
            ]
          })

          await context.writeCourse(testTeacher(1), {
            name: "Second Course",
            students: [
              testStudent(3)
            ]
          })
        })
      ],
      observe: [
        effect("all courses exist in the database with correct details", async (context) => {
          await expect(context.getAllCourses(testTeacher(1)), resolvesTo(arrayWith([
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
          await context.withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(4)))
        })
      ],
      perform: [
        step("update the course by changing its name and modifying students", async (context) => {
          const courseToUpdate = await context.getCourseValue(testTeacher(1), testCourse(1))

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
          await context.saveCourse(testTeacher(1), courseToUpdate);
        })
      ],
      observe: [
        effect("the updated course exists in the database with correct details", async (context) => {
          // Note that the id of the course is still saved in the test helper by the testCourse(1).name
          const updatedCourse = await context.getCourseValue(testTeacher(1), testCourse(1));

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
          await context.withCourse(testTeacher(1), testCourse(4).withStudents(testStudents(4)))
        })
      ],
      perform: [
        step("update only the course name", async (context) => {
          const courseToUpdate = await context.getCourseValue(testTeacher(1), testCourse(4));

          // Update just the course name
          courseToUpdate.name = "Only Name Updated";

          // Save the updated course
          await context.saveCourse(testTeacher(1), courseToUpdate);
        })
      ],
      observe: [
        effect("the course name is updated but students remain unchanged", async (context) => {
          await expect(context.getAllCourses(testTeacher(1)), resolvesTo(arrayWith([
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
    }),

  example(testableDatabase)
    .description("deletes a course with all its students")
    .script({
      suppose: [
        fact("there is a course with students", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(3)))
        })
      ],
      perform: [
        step("delete the course", async (context) => {
          const courseToDelete = await context.getCourseValue(testTeacher(1), testCourse(1))
          await context.deleteCourse(testTeacher(1), courseToDelete)
        })
      ],
      observe: [
        effect("the course and its students are removed from the database", async (context) => {
          const courses = await context.getAllCourses(testTeacher(1))
          expect(courses, is(arrayWith([])))
        })
      ]
    }),

  example(testableDatabase)
    .description("deletes one course without affecting others")
    .script({
      suppose: [
        fact("there are multiple courses", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1).withStudents([testStudent(1), testStudent(2)]))
          await context.withCourse(testTeacher(1), testCourse(2).withStudents([testStudent(3), testStudent(4)]))
        })
      ],
      perform: [
        step("delete one course", async (context) => {
          const courseToDelete = await context.getCourseValue(testTeacher(1), testCourse(1))
          await context.deleteCourse(testTeacher(1), courseToDelete)
        })
      ],
      observe: [
        effect("only the deleted course is removed, others remain intact", async (context) => {
          const courses = await context.getAllCourses(testTeacher(1))

          expect(courses, is(arrayWith([
            objectWith({
              name: equalTo(testCourse(2).name),
              students: arrayWith<Student>([
                studentName(3),
                studentName(4)
              ], { withAnyOrder: true })
            })
          ])))
        })
      ]
    }),

  example(testableDatabase)
    .description("prevents saving a course created by another teacher")
    .script({
      suppose: [
        fact("there is a course created by one teacher", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(2)))
        })
      ],
      perform: [
        step("another teacher attempts to save changes to that course", async (context) => {
          const courseToModify = await context.getCourseValue(testTeacher(1), testCourse(1))
          courseToModify.name = "I changed it!"

          await expect(context.saveCourse(testTeacher(2), courseToModify), rejectsWith(errorWithMessage(
            stringContaining("not found")
          )))
        })
      ],
      observe: [
        effect("the course remains unchanged", async (context) => {
          const course = await context.getCourseValue(testTeacher(1), testCourse(1))
          expect(course.name, is(equalTo("Course #1")))
        })
      ]
    }),

  example(testableDatabase)
    .description("prevents deleting a course created by another teacher")
    .script({
      suppose: [
        fact("there is a course created by one teacher", async (context) => {
          await context.withCourse(testTeacher(1), testCourse(1).withStudents(testStudents(2)))
        })
      ],
      perform: [
        step("another teacher attempts to delete that course", async (context) => {
          const courseToDelete = await context.getCourseValue(testTeacher(1), testCourse(1))
          await expect(context.deleteCourse(testTeacher(2), courseToDelete), rejectsWith(errorWithMessage(
            stringContaining("not found")
          )))
        })
      ],
      observe: [
        effect("the course still exists for the original teacher", async (context) => {
          const courses = await context.getAllCourses(testTeacher(1))
          expect(courses, is(arrayWith([
            objectWith({
              name: equalTo("Course #1")
            })
          ])))
        })
      ]
    }),

  example(testableDatabase)
    .description("multiple teachers can create and manage their own courses independently")
    .script({
      perform: [
        step("two teachers each create their own courses", async (context) => {
          await context.writeCourse(testTeacher(1), {
            name: "Teacher 1's Course",
            students: [testStudent(1), testStudent(2)]
          })

          await context.writeCourse(testTeacher(2), {
            name: "Teacher 2's Course",
            students: [testStudent(3), testStudent(4)]
          })
        }),
        step("teachers update their own courses", async (context) => {
          const teacher1Courses = await context.getAllCourses(testTeacher(1))
          const teacher1Course = teacher1Courses[0]
          teacher1Course.name = "Teacher 1's Updated Course"
          await context.saveCourse(testTeacher(1), teacher1Course)

          const teacher2Courses = await context.getAllCourses(testTeacher(2))
          const teacher2Course = teacher2Courses[0]
          teacher2Course.name = "Teacher 2's Updated Course"
          await context.saveCourse(testTeacher(2), teacher2Course)
        })
      ],
      observe: [
        effect("each teacher's changes affect only their own courses", async (context) => {
          const teacher1Courses = await context.getAllCourses(testTeacher(1))
          expect(teacher1Courses, is(arrayWith([
            objectWith({
              name: equalTo("Teacher 1's Updated Course")
            })
          ])))

          const teacher2Courses = await context.getAllCourses(testTeacher(2))
          expect(teacher2Courses, is(arrayWith([
            objectWith({
              name: equalTo("Teacher 2's Updated Course")
            })
          ])))
        })
      ]
    }),

  example(testableDatabase)
    .description("saving a non-existent course")
    .script({
      observe: [
        effect("saving a course that does not exist throws an error", async (context) => {
          const nonExistentCourse: Course = {
            id: "non-existent-id",
            name: "Non-existent Course",
            students: []
          }

          await expect(context.saveCourse(testTeacher(1), nonExistentCourse), rejectsWith(errorWithMessage(
            stringContaining("not found")
          )))
        })
      ]
    })
]);
