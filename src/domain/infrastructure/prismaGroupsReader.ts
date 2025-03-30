import { PrismaClient } from "@prisma/client";
import { CourseId } from "../course";
import { Group } from "../group";
import { GroupsReader } from "../groupReader";

export class PrismaGroupsReader implements GroupsReader {
  constructor(private prisma: PrismaClient) {}

  async get(courseId: CourseId): Promise<Array<Group>> {
    return [];
  } 
}