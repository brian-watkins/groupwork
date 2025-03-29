import { Student } from "../../src/domain/student";

export function testStudent(testId: number): TestStudent {
  return new TestStudent(testId)
}

export function testStudents(size: number): Array<TestStudent> {
  let students: Array<TestStudent> = []
  for (let i = 1; i <= size; i++) {
    students.push(testStudent(i))
  }
  return students
}

export class TestStudent implements Student {
  id: string;
  name: string;

  constructor(testId: number) {
    this.id = `student-${testId}`
    this.name = `Fun Student ${testId}`
  }
}