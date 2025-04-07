import { Course, CourseId } from "@/domain/course";
import { CourseReader } from "@/domain/courseReader";
import { Student } from "@/domain/student";
import { Teacher } from "@/domain/teacher";
import { PrismaClient } from "@prisma/client";

export class PrismaCourseReader implements CourseReader {
  constructor(private prisma: PrismaClient) { }

  async get(teacher: Teacher, courseId: CourseId): Promise<Course> {
    const prismaData = await this.prisma.course.findUnique({
      where: { id: courseId, teacherId: teacher.id },
      include: { students: true }
    });

    if (!prismaData) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    // Map from Prisma model to domain model
    const students: Student[] = prismaData.students.map(student => ({
      id: student.id,
      name: student.name
    }));

    return {
      id: prismaData.id,
      name: prismaData.name,
      students
    };
  }

  async getAll(teacher: Teacher): Promise<Course[]> {
    const prismaData = await this.prisma.course.findMany({
      where: { teacherId: teacher.id },
      include: { students: true }
    });

    return prismaData.map(course => ({
      id: course.id,
      name: course.name,
      students: course.students.map(student => ({
        id: student.id,
        name: student.name
      }))
    }))
  }
}