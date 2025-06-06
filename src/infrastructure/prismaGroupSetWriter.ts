import { GroupSet } from "@/domain/groupSet"
import { GroupSetDetails, GroupSetWriter } from "@/domain/groupSetWriter"
import { PrismaClient } from "@/lib/prisma"
import { DateTime } from "luxon"

export class PrismaGroupSetWriter implements GroupSetWriter {
  constructor(private prisma: PrismaClient) {}

  async create(details: GroupSetDetails): Promise<GroupSet> {
    const createdGroupSet = await this.prisma.groupSet.create({
      data: {
        name: details.name,
        courseId: details.courseId,
        createdAt: getCreatedAtDate(details.createdAt),
        groups: {
          create: details.groups.map((group) => ({
            students: {
              connect: Array.from(group.members).map((student) => ({
                id: student.id,
              })),
            },
          })),
        },
      },
      include: {
        groups: {
          include: {
            students: true,
          },
        },
      },
    })

    return {
      id: createdGroupSet!.id,
      name: createdGroupSet!.name,
      courseId: createdGroupSet!.courseId,
      createdAt: DateTime.fromJSDate(createdGroupSet!.createdAt),
      groups: createdGroupSet!.groups.map((group) => ({
        members: new Set(
          group.students.map((student) => ({
            id: student.id,
            name: student.name,
          })),
        ),
      })),
    }
  }

  async save(groupSet: GroupSet): Promise<void> {
    await this.prisma.group.deleteMany({
      where: {
        groupSetId: groupSet.id,
      },
    })

    await this.prisma.groupSet.update({
      where: {
        id: groupSet.id,
      },
      data: {
        name: groupSet.name,
        groups: {
          create: groupSet.groups.map((group) => ({
            students: {
              connect: Array.from(group.members).map((student) => ({
                id: student.id,
              })),
            },
          })),
        },
      },
    })
  }

  async delete(groupSet: GroupSet): Promise<void> {
    await this.prisma.groupSet.delete({
      where: {
        id: groupSet.id,
      },
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
