import { PrismaClient } from "@prisma/client";
import { GroupSetDetails, GroupSetWriter } from "../groupSetWriter";
import { DateTime } from "luxon";
import { GroupSet } from "../groupSet";

export class PrismaGroupSetWriter implements GroupSetWriter {
  constructor(private prisma: PrismaClient) { }

  async create(details: GroupSetDetails): Promise<GroupSet> {
    const createdGroupSet = await this.prisma.groupSet.create({
      data: {
        name: details.name,
        courseId: details.courseId,
        createdAt: getCreatedAtDate(details.createdAt),
        groups: {
          create: details.groups.map(group => ({
            students: {
              connect: Array.from(group.members).map(student => ({
                id: student.id
              }))
            }
          }))
        }
      },
      include: {
        groups: {
          include: {
            students: true
          }
        }
      }
    })

    return {
      id: createdGroupSet!.id,
      name: createdGroupSet!.name,
      courseId: createdGroupSet!.courseId,
      createdAt: DateTime.fromJSDate(createdGroupSet!.createdAt),
      groups: createdGroupSet!.groups.map(group => ({
        members: new Set(group.students.map(student => ({
          id: student.id,
          name: student.name
        })))
      }))
    }
  }
}

function getCreatedAtDate(date: DateTime | undefined): Date {
  if (date === undefined) {
    return DateTime.now().toJSDate()
  } else {
    return date.toJSDate()
  }
}