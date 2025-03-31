import { Context } from "best-behavior";
import { CourseReader } from "@/domain/courseReader";
import { GroupsReader } from "@/domain/groupReader";
import { Group } from "@/domain/group";
import { Course, CourseId } from "@/domain/course";
import { assignGroups } from "@/domain/assignGroups";

export const testableGroupWorkDomain: Context<TestableGroupWork> = {
  init: () => new TestableGroupWork()
}

class TestableGroupWork {
  private courseReader: TestCourseReader | undefined
  private groupsReader: TestGroupsReader = new TestGroupsReader([])
  private currentGroups: Array<Group> | undefined

  withCourse(course: Course) {
    this.courseReader = new TestCourseReader(course)
    return this
  }

  withGroups(groups: Array<Group>) {
    this.groupsReader = new TestGroupsReader(groups)
    return this
  }

  async chooseGroupsOf(size: number): Promise<void> {
    this.currentGroups = await assignGroups(this.courseReader!, this.groupsReader!, { courseId: "some-id", size })
  }

  getCurrentGroups(): Array<Group> {
    return this.currentGroups ?? []
  }
}

class TestCourseReader implements CourseReader {
  constructor(private course: Course) { }

  async get(courseId: CourseId): Promise<Course> {
    return this.course
  }
}

class TestGroupsReader implements GroupsReader {
  constructor (private groups: Array<Group>) { }

  async get(courseId: CourseId): Promise<Array<Group>> {
    return this.groups
  }
}