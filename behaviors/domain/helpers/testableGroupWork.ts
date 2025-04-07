import { Context } from "best-behavior";
import { CourseReader } from "@/domain/courseReader";
import { GroupsReader } from "@/domain/groupReader";
import { Group, workedTogetherAlready } from "@/domain/group";
import { Course, CourseId } from "@/domain/course";
import { assignGroups } from "@/domain/assignGroups";
import { Student } from "@/domain/student";
import { Teacher } from "@/domain/teacher";
import { testTeacher } from "../../app/helpers/testTeacher";

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
    this.currentGroups = await assignGroups(testTeacher(1), this.courseReader!, this.groupsReader!, { courseId: "some-id", size })
  }

  getCurrentCollaborators(group: Group): Array<Array<Student>> {
    return workedTogetherAlready(this.groupsReader.groups, group)
  }

  getCurrentGroups(): Array<Group> {
    return this.currentGroups ?? []
  }
}

class TestCourseReader implements CourseReader {
  constructor(private course: Course) { }

  getAll(teacher: Teacher): Promise<Array<Course>> {
    throw new Error("Method not implemented.");
  }

  async get(teacher: Teacher, courseId: CourseId): Promise<Course> {
    if (teacher.id !== testTeacher(1).id) {
      throw new Error("Unknown teacher!")
    }

    return this.course
  }
}

class TestGroupsReader implements GroupsReader {
  constructor(readonly groups: Array<Group>) { }

  async get(courseId: CourseId): Promise<Array<Group>> {
    return this.groups
  }
}