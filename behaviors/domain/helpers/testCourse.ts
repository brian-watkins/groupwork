import { Course } from "../../../src/domain/course";
import { Student } from "../../../src/domain/student";

export function testCourse(testId: number): TestCourse {
  return new TestCourse(testId)
}

export class TestCourse implements Course {
  id: string
  name: string
  students: Student[] = []

  constructor(testId: number) {
    this.id = `course-${testId}`
    this.name = `Course #${testId}`
  }

  withStudents(students: Array<Student>) {
    this.students = students
    return this
  }
}