import { PrismaClient } from "@prisma/client";
import { GroupSetDetails, GroupSetWriter } from "../groupSetWriter";
import { DateTime } from "luxon";

export class PrismaGroupSetWriter implements GroupSetWriter {
  constructor(private prisma: PrismaClient) { }

  async create(details: GroupSetDetails): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.groupSet.create({
        data: {
          name: details.name,
          courseId: details.course.id,
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
        }
      })
    })
  }
}

function getCreatedAtDate(date: DateTime | undefined): Date {
  if (date === undefined) {
    return DateTime.now().toJSDate()
  } else {
    return date.toJSDate()
  }
}