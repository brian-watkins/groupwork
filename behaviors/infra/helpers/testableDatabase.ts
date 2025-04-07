import { Course, CourseId } from "@/domain/course";
import { Group } from "@/domain/group";
import { GroupSet } from "@/domain/groupSet";
import { GroupSetDetails } from "@/domain/groupSetWriter";
import { PrismaCourseReader } from "@/infrastructure/prismaCourseReader";
import { PrismaGroupSetReader } from "@/infrastructure/prismaGroupSetReader";
import { PrismaGroupsReader } from "@/infrastructure/prismaGroupsReader";
import { PrismaGroupSetWriter } from "@/infrastructure/prismaGroupSetWriter";
import { PrismaClient } from "@prisma/client";
import { Context } from "best-behavior";
import { CourseDetails } from "@/domain/courseWriter";
import { PrismaCourseWriter } from "@/infrastructure/prismaCourseWriter";
import { Teacher } from "@/domain/teacher";
import { CourseReaderError } from "@/domain/courseReader";
import { Result, ResultType } from "@/domain/result";
import { PrismaTeacherAuthorization } from "@/infrastructure/prismaTeacherAuthorization";

export const testableDatabase: Context<TestDatabase> = {
  init: async () => {
    const db = new TestDatabase()
    await db.reset()
    return db
  }
}

class TestDatabase {
  private prisma = new PrismaClient();
  private createdCourses: Map<string, CourseId> = new Map()

  async reset(): Promise<void> {
    await this.prisma.course.deleteMany({})
  }

  getCreatedCourseId(course: Course): CourseId {
    return this.createdCourses.get(course.name)!
  }

  async withCourse(teacher: Teacher, course: Course) {
    const created = await this.prisma.course.create({
      data: {
        name: course.name,
        teacherId: teacher.id,
        students: {
          createMany: {
            data: course.students.map(student => {
              return {
                name: student.name
              }
            })
          }
        }
      }
    })
    this.createdCourses.set(created.name, created.id)
  }

  async getCourseValue(teacher: Teacher, course: Course): Promise<Course> {
    const result = await this.getCourse(teacher, course)
    if (result.type === ResultType.ERROR) {
      throw new Error("Got error trying to get course!")
    }
    return result.value
  }

  async getCourse(teacher: Teacher, course: Course): Promise<Result<Course, CourseReaderError>> {
    const courseId = this.createdCourses.get(course.name)
    return this.getCourseById(teacher, courseId!)
  }

  async getCourseById(teacher: Teacher, courseId: CourseId): Promise<Result<Course, CourseReaderError>> {
    const courseReader = new PrismaCourseReader(this.prisma)
    return courseReader.get(teacher, courseId)
  }

  async getAllCourses(teacher: Teacher): Promise<Array<Course>> {
    const courseReader = new PrismaCourseReader(this.prisma)
    return courseReader.getAll(teacher)
  }

  async writeCourse(teacher: Teacher, details: CourseDetails): Promise<void> {
    const courseWriter = new PrismaCourseWriter(this.prisma)
    await courseWriter.write(teacher, details)
  }

  async saveCourse(teacher: Teacher, course: Course): Promise<void> {
    const courseWriter = new PrismaCourseWriter(this.prisma)
    await courseWriter.save(teacher, course)
  }

  async deleteCourse(teacher: Teacher, course: Course): Promise<void> {
    const courseWriter = new PrismaCourseWriter(this.prisma)
    await courseWriter.delete(teacher, course)
  }

  async canManageCourse(teacher: Teacher, course: Course): Promise<boolean> {
    const courseId = this.createdCourses.get(course.name) ?? "UNKNOWN_ID"
    const teacherAuth = new PrismaTeacherAuthorization(this.prisma)
    return teacherAuth.canManageCourse(teacher, courseId)
  }

  async createGroupSet(details: GroupSetDetails): Promise<GroupSet> {
    const groupSetWriter = new PrismaGroupSetWriter(this.prisma)
    return await groupSetWriter.create(details)
  }

  async updateGroupSet(groupSet: GroupSet): Promise<void> {
    const groupSetWriter = new PrismaGroupSetWriter(this.prisma)
    await groupSetWriter.save(groupSet)
  }

  async getGroupSetsForCourse(course: Course): Promise<Array<GroupSet>> {
    const courseId = this.createdCourses.get(course.name)
    const groupSetReader = new PrismaGroupSetReader(this.prisma)
    return groupSetReader.getByCourse(courseId!)
  }

  async getGroupsForCourse(course: Course): Promise<Array<Group>> {
    const courseId = this.createdCourses.get(course.name)
    const groupsReader = new PrismaGroupsReader(this.prisma)
    return groupsReader.get(courseId!)
  }
}