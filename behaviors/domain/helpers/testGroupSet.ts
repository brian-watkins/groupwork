import { Course, CourseId } from "@/domain/course";
import { Group } from "@/domain/group";
import { GroupSet, GroupSetId } from "@/domain/groupSet";
import { DateTime } from "luxon";

export function testGroupSet(testId: number): TestGroupSet {
  return new TestGroupSet(testId)
}

class TestGroupSet implements GroupSet {
  id: GroupSetId
  name: string
  courseId!: CourseId
  groups!: Array<Group>
  createdAt: DateTime

  constructor(
    testId: number,
  ) {
    this.id = `groupSet-${testId}`
    this.name = `Group Set ${testId}`
    this.createdAt = DateTime.fromISO(`2025-04-${testId}`)
  }

  forCourse(course: Course): TestGroupSet {
    this.courseId = course.id
    return this
  }

  withGroups(groups: Array<Group>): TestGroupSet {
    this.groups = groups
    return this
  }
}