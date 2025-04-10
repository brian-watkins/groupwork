import { DateTime } from "luxon";
import { PrismaClient } from "@prisma/client";
import { GroupSetReader } from "@/domain/groupSetReader";
import { CourseId } from "@/domain/course";
import { GroupSet } from "@/domain/groupSet";
import { Group } from "@/domain/group";
import { Student } from "@/domain/student";

export class PrismaGroupSetReader implements GroupSetReader {
  constructor(private prisma: PrismaClient) {}

  async getByCourse(courseId: CourseId): Promise<Array<GroupSet>> {
    const prismaData = await this.prisma.groupSet.findMany({
      where: { courseId },
      include: {
        groups: {
          include: {
            students: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return prismaData.map(groupSet => this.mapToDomainModel(groupSet));
  }
  
  private mapToDomainModel(prismaGroupSet: any): GroupSet {
    const groups: Group[] = prismaGroupSet.groups.map((prismaGroup: any) => {
      const members = new Set<Student>(
        prismaGroup.students.map((student: any) => ({
          id: student.id,
          name: student.name
        }))
      );

      return { members };
    });

    return {
      id: prismaGroupSet.id,
      name: prismaGroupSet.name,
      courseId: prismaGroupSet.courseId,
      groups,
      createdAt: DateTime.fromJSDate(prismaGroupSet.createdAt)
    };
  }
}