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

  async getCourse(teacher: Teacher, course: Course): Promise<Course> {
    const courseId = this.createdCourses.get(course.name)
    return this.getCourseById(teacher, courseId!)
  }

  async getCourseById(teacher: Teacher, courseId: CourseId): Promise<Course> {
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

  async createGroupSet(details: GroupSetDetails): Promise<GroupSet> {
    const groupSetWriter = new PrismaGroupSetWriter(this.prisma)
    return await groupSetWriter.create(details)
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