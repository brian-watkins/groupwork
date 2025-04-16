import { CourseId } from "@/domain/course";
import { Group } from "@/domain/group";
import { GroupsReader } from "@/domain/groupReader";
import { PrismaClient } from "@/lib/prisma";

export class PrismaGroupsReader implements GroupsReader {
  constructor(private prisma: PrismaClient) {}

  async get(courseId: CourseId): Promise<Array<Group>> {
    const groupSets = await this.prisma.groupSet.findMany({
      where: { courseId },
      include: {
        groups: {
          include: {
            students: true
          }
        }
      }
    });

    // Flatten the groups from all group sets
    const groups: Array<Group> = [];
    
    for (const groupSet of groupSets) {
      for (const prismaGroup of groupSet.groups) {
        const members = new Set(
          prismaGroup.students.map(student => ({
            id: student.id,
            name: student.name
          }))
        );
        
        groups.push({ members });
      }
    }

    return groups;
  } 
}