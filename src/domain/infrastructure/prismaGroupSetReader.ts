import { GroupSet } from "../groupSet";
import { GroupSetReader } from "../groupSetReader";
import { Group } from "../group";
import { Student } from "../student";
import { DateTime } from "luxon";
import { CourseId } from "../course";
import { PrismaClient } from "@prisma/client";

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
      }
    });

    return prismaData.map(groupSet => this.mapToDomainModel(groupSet));
  }
  
  private mapToDomainModel(prismaGroupSet: any): GroupSet {
    const groups: Group[] = prismaGroupSet.groups.map((prismaGroup: any) => {
      // Create a Set of Student objects from the group students
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