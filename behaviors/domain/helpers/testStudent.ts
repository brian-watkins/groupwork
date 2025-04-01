import { Student } from "../../../src/domain/student";

export function testStudent(testId: number): TestStudent {
  return new TestStudent(testId)
}

export interface StudentOptions {
  startingIndex?: number
}

export function testStudents(size: number, options: StudentOptions = {}): Array<TestStudent> {
  const start = options.startingIndex ?? 1
  let students: Array<TestStudent> = []
  for (let i = start; i < size + start; i++) {
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