import { Group } from "@/domain/group";
import { GroupSet } from "@/domain/groupSet";
import { DateTime } from "luxon";

export function testGroupSet(testId: number): TestGroupSet {
  return new TestGroupSet(testId)
}

class TestGroupSet implements GroupSet {
  id: string;
  name: string;
  courseId: string;
  groups: Group[] = []
  createdAt: DateTime<boolean>;

  constructor(testId: number) {
    this.id = `groupset-${testId}`
    this.name = `Group Set #${testId}`
    this.courseId = `course-${testId}`
    this.createdAt = DateTime.fromISO(`2025-05-${testId}`)
  }

  withGroups(groups: Array<Group>) {
    this.groups = groups
    return this
  }
}