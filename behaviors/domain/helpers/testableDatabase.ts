import { Course, CourseId } from "@/domain/course";
import { GroupSet, GroupSetId } from "@/domain/groupSet";
import { GroupSetDetails } from "@/domain/groupSetWriter";
import { PrismaCourseReader } from "@/domain/infrastructure/prismaCourseReader";
import { PrismaGroupSetReader } from "@/domain/infrastructure/prismaGroupSetReader";
import { PrismaGroupSetWriter } from "@/domain/infrastructure/prismaGroupSetWriter";
import { PrismaClient } from "@prisma/client";
import { Context } from "best-behavior";

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
  private createdGroupSets: Map<string, GroupSetId> = new Map()

  async reset(): Promise<void> {
    await this.prisma.course.deleteMany({})
  }

  async withCourse(course: Course) {
    const created = await this.prisma.course.create({
      data: {
        name: course.name,
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

  async getCourse(course: Course): Promise<Course> {
    const courseId = this.createdCourses.get(course.name)
    const courseReader = new PrismaCourseReader(this.prisma)
    return courseReader.get(courseId!)
  }

  async createGroupSet(details: GroupSetDetails): Promise<void> {
    const groupSetWriter = new PrismaGroupSetWriter(this.prisma)
    await groupSetWriter.create(details)
  }

  async getGroupSetsForCourse(course: Course): Promise<Array<GroupSet>> {
    const courseId = this.createdCourses.get(course.name)
    const groupSetReader = new PrismaGroupSetReader(this.prisma)
    return groupSetReader.getByCourse(courseId!)
  }
}