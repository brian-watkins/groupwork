import { Context } from "best-behavior";
import { CourseReader, CourseReaderError } from "@/domain/courseReader";
import { GroupsReader } from "@/domain/groupReader";
import { Group, workedTogetherAlready } from "@/domain/group";
import { Course, CourseId } from "@/domain/course";
import { assignGroups, AssignGroupsError } from "@/domain/assignGroups";
import { Student } from "@/domain/student";
import { Teacher, TeacherId } from "@/domain/teacher";
import { GroupSetDetails, GroupSetWriter } from "@/domain/groupSetWriter";
import { GroupSet } from "@/domain/groupSet";
import { createGroupSet, GroupSetError } from "@/domain/createGroupSet";
import { errorResult, okResult, Result } from "@/domain/result";
import { DateTime } from "luxon";
import { TeacherAuthorization } from "@/domain/teacherReader";
import { saveGroupSet, UpdateGroupSetError } from "@/domain/saveGroupSet";
import { deleteGroupSet, DeleteGroupSetError } from "@/domain/deleteGroupSet";

export const testableGroupWorkDomain: Context<TestableGroupWork> = {
  init: () => new TestableGroupWork()
}

class TestableGroupWork {
  private courseReader: TestCourseReader | undefined
  private groupsReader: TestGroupsReader = new TestGroupsReader([])
  private groupSetWriter: TestGroupSetWriter = new TestGroupSetWriter()
  private currentGroups: Result<Array<Group>, AssignGroupsError> | undefined
  private teacherAuth: TestTeacherAuthorization = new TestTeacherAuthorization()

  withCourse(teacher: Teacher, course: Course) {
    this.courseReader = new TestCourseReader(teacher, course)
    this.teacherAuth.addCourse(teacher, course)
    return this
  }

  withGroups(groups: Array<Group>) {
    this.groupsReader = new TestGroupsReader(groups)
    return this
  }

  async chooseGroupsOf(teacher: Teacher, size: number): Promise<void> {
    this.currentGroups = await assignGroups(teacher, this.courseReader!, this.groupsReader!, { courseId: "some-id", size })
  }

  getCurrentCollaborators(group: Group): Array<Array<Student>> {
    return workedTogetherAlready(this.groupsReader.groups, group)
  }

  getCurrentGroups(): Result<Array<Group>, AssignGroupsError> {
    if (this.currentGroups === undefined) {
      throw new Error("No groups chosen!")
    }

    return this.currentGroups
  }

  async createGroupSet(teacher: Teacher, details: GroupSetDetails): Promise<Result<GroupSet, GroupSetError>> {
    return createGroupSet(
      this.teacherAuth,
      this.groupSetWriter,
      teacher,
      details
    )
  }

  async updateGroupSet(teacher: Teacher, groupSet: GroupSet): Promise<Result<GroupSet, UpdateGroupSetError>> {
    return saveGroupSet(this.teacherAuth, this.groupSetWriter, teacher, groupSet)
  }

  async deleteGroupSet(teacher: Teacher, groupSet: GroupSet): Promise<Result<boolean, DeleteGroupSetError>> {
    return deleteGroupSet(
      this.teacherAuth,
      this.groupSetWriter,
      teacher,
      groupSet
    );
  }

  get createdGroupSets(): GroupSetDetails[] {
    return this.groupSetWriter.createdGroupSets
  }
}

class TestTeacherAuthorization implements TeacherAuthorization {
  private courses: Map<TeacherId, Array<CourseId>> = new Map()

  addCourse(teacher: Teacher, course: Course) {
    let courses = this.courses.get(teacher.id)
    if (courses === undefined) {
      courses = []
      this.courses.set(teacher.id, courses)
    }
    return courses.push(course.id)
  }

  async canManageCourse(teacher: Teacher, courseId: CourseId): Promise<boolean> {
    return this.courses.get(teacher.id)?.some(id => id === courseId) ?? false
  }
}

class TestCourseReader implements CourseReader {
  constructor(private teacher: Teacher, private course: Course) { }

  getAll(teacher: Teacher): Promise<Array<Course>> {
    throw new Error("Method not implemented.");
  }

  async get(teacher: Teacher, courseId: CourseId): Promise<Result<Course, CourseReaderError>> {
    if (teacher.id !== this.teacher.id) {
      return errorResult(CourseReaderError.NotFound)
    }

    return okResult(this.course)
  }
}

class TestGroupsReader implements GroupsReader {
  constructor(readonly groups: Array<Group>) { }

  async get(courseId: CourseId): Promise<Array<Group>> {
    return this.groups
  }
}

class TestGroupSetWriter implements GroupSetWriter {
  createdGroupSets: GroupSetDetails[] = []

  async create(details: GroupSetDetails): Promise<GroupSet> {
    this.createdGroupSets.push(details)
    return {
      id: "group-set-1",
      name: details.name,
      courseId: details.courseId,
      createdAt: DateTime.now(),
      groups: details.groups
    }
  }

  async save(groupSet: GroupSet): Promise<void> { }

  async delete(groupSet: GroupSet): Promise<void> { }
}