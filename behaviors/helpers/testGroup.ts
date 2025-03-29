import { Group } from "../../src/domain/group";
import { Student } from "../../src/domain/student";

export function testGroup(...members: Array<Student>): TestGroup {
  return new TestGroup(members)
}

class TestGroup implements Group {
  readonly members: Set<Student>

  constructor(students: Array<Student>) {
    this.members = new Set(students)
  }
}