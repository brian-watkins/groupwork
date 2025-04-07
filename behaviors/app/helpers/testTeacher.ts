import { Teacher } from "@/domain/teacher";

export function authenticatedTeacher(): Teacher {
  return {
    id: process.env["E2E_CLERK_USER_ID"]!
  }
}

export function testTeacher(testId: number): TestTeacher {
  return new TestTeacher(testId)
}

export class TestTeacher implements Teacher {
  id: string;

  constructor(testId: number) {
    this.id = `teacher-${testId}`
  }
}