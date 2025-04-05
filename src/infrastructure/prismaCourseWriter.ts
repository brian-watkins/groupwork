import { CourseDetails, CourseWriter } from "@/domain/courseWriter";
import { PrismaClient } from "@prisma/client";

export class PrismaCourseWriter implements CourseWriter {
  constructor(private prisma: PrismaClient) {}

  async write(courseDetails: CourseDetails): Promise<void> {
    await this.prisma.course.create({
      data: {
        name: courseDetails.name,
        students: {
          create: courseDetails.students.map(student => ({
            name: student.name
          }))
        }
      }
    })
  }
}