import { CourseId } from "@/domain/course";
import { Group } from "@/domain/group";
import { GroupsReader } from "@/domain/groupReader";
import { PrismaClient } from "@prisma/client";

export class PrismaGroupsReader implements GroupsReader {
  constructor(private prisma: PrismaClient) {}

  async get(courseId: CourseId): Promise<Array<Group>> {
    return [];
  } 
}