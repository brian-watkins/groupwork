import { Context } from "best-behavior";
import { Course, CourseId } from "../../../src/domain/course";
import { Group } from "../../../src/domain/group";
import { chooseGroups, CourseReader, GroupsReader } from "../../../src/domain/chooseGroups";

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
    this.currentGroups = await chooseGroups(this.courseReader!, this.groupsReader!, { courseId: "some-id", size })
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