import { Course } from "@/domain/course";
import { CourseDetails, CourseWriter } from "@/domain/courseWriter";
import { Student, StudentId } from "@/domain/student";
import { PrismaClient } from "@prisma/client";

export class PrismaCourseWriter implements CourseWriter {
  constructor(private prisma: PrismaClient) { }

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

  async save(course: Course): Promise<void> {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id: course.id },
      include: { students: true }
    });

    if (!existingCourse) {
      throw new Error(`Course with id ${course.id} not found`);
    }

    const studentsToDelete = findStudentsToDelete(existingCourse, course)

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.course.update({
          where: { id: course.id },
          data: { name: course.name }
        });

        if (studentsToDelete.length > 0) {
          await tx.student.deleteMany({
            where: {
              id: { in: studentsToDelete.map(s => s.id) }
            }
          });
        }

        for (const student of course.students) {
          if (student.id) {
            await tx.student.update({
              where: { id: student.id },
              data: { name: student.name }
            });
          } else {
            await tx.student.create({
              data: {
                name: student.name,
                courseId: course.id
              }
            })
          }
        }
      });
    } catch (error) {
      console.error('Error during course update transaction:', error);
      throw error;
    }
  }
}

function findStudentsToDelete(existingCourse: Course, course: Course): Array<Student> {
  const studentIds = course.students
    .filter(student => student.id)
    .map(student => student.id)

  return existingCourse.students.filter(
    student => !studentIds.includes(student.id)
  )
}