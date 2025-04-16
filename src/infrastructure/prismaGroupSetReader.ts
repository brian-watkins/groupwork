import { DateTime } from "luxon";
import { PrismaClient } from "@/lib/prisma";
import { GroupSetReader } from "@/domain/groupSetReader";
import { CourseId } from "@/domain/course";
import { GroupSet } from "@/domain/groupSet";
import { Prisma } from "@/lib/prisma"
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
  
  private mapToDomainModel(prismaGroupSet: GroupSetWithGroupsWithStudents): GroupSet {
    const groups: Group[] = prismaGroupSet.groups.map((prismaGroup) => {
      const members = new Set<Student>(
        prismaGroup.students.map((student) => ({
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

type GroupSetWithGroupsWithStudents = Prisma.GroupSetGetPayload<{ include: { groups: { include: { students: true }} }}>