import { CourseId } from "@/domain/course";
import { Teacher } from "@/domain/teacher";
import { TeacherAuthorization } from "@/domain/teacherReader";
import { PrismaClient } from "@/lib/prisma";

export class PrismaTeacherAuthorization implements TeacherAuthorization {
  
  constructor(private prisma: PrismaClient) { }

  async canManageCourse(teacher: Teacher, courseId: CourseId): Promise<boolean> {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId
      }
    });

    if (!course) {
      return false;
    }

    return course.teacherId === teacher.id;
  }

}