import { PrismaClient } from "@prisma/client";
import { Course, CourseId } from "../course";
import { CourseReader } from "../courseReader";
import { Student } from "../student";

export class PrismaCourseReader implements CourseReader {
  constructor(private prisma: PrismaClient) {}

  async get(courseId: CourseId): Promise<Course> {
    const prismaData = await this.prisma.course.findUnique({
      where: { id: courseId },
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
  
  // Let's add a method to get all courses, which we'll need for the homepage
  async getAll(): Promise<Course[]> {
    const prismaData = await this.prisma.course.findMany({
      include: { students: true }
    });

    return prismaData.map(course => ({
      id: course.id,
      name: course.name,
      students: course.students.map(student => ({
        id: student.id,
        name: student.name
      }))
    }));
  }
}