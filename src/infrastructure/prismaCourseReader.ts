import { Course, CourseId } from "@/domain/course"
import { CourseReader, CourseReaderError } from "@/domain/courseReader"
import { errorResult, okResult, Result } from "@/domain/result"
import { Student } from "@/domain/student"
import { Teacher } from "@/domain/teacher"
import { PrismaClient } from "@/lib/prisma"

export class PrismaCourseReader implements CourseReader {
  constructor(private prisma: PrismaClient) {}

  async get(
    teacher: Teacher,
    courseId: CourseId,
  ): Promise<Result<Course, CourseReaderError>> {
    const prismaData = await this.prisma.course.findUnique({
      where: { id: courseId, teacherId: teacher.id },
      include: { students: true },
    })

    if (!prismaData) {
      return errorResult(CourseReaderError.NotFound)
    }

    const students: Student[] = prismaData.students.map((student) => ({
      id: student.id,
      name: student.name,
    }))

    return okResult({
      id: prismaData.id,
      name: prismaData.name,
      students,
    })
  }

  async getAll(teacher: Teacher): Promise<Course[]> {
    const prismaData = await this.prisma.course.findMany({
      where: { teacherId: teacher.id },
      include: { students: true },
    })

    return prismaData.map((course) => ({
      id: course.id,
      name: course.name,
      students: course.students.map((student) => ({
        id: student.id,
        name: student.name,
      })),
    }))
  }
}
