import { PrismaCourseReader } from "@/infrastructure/prismaCourseReader";
import { PrismaCourseWriter } from "@/infrastructure/prismaCourseWriter";
import { PrismaGroupsReader } from "@/infrastructure/prismaGroupsReader";
import { PrismaGroupSetReader } from "@/infrastructure/prismaGroupSetReader";
import { PrismaGroupSetWriter } from "@/infrastructure/prismaGroupSetWriter";
import { prisma } from "@/lib/prisma";
import { CourseReader } from "@/domain/courseReader";
import { CourseWriter } from "@/domain/courseWriter";
import { GroupsReader } from "@/domain/groupReader";
import { GroupSetReader } from "@/domain/groupSetReader";
import { GroupSetWriter } from "@/domain/groupSetWriter";

export const courseReader: CourseReader = new PrismaCourseReader(prisma);
export const courseWriter: CourseWriter = new PrismaCourseWriter(prisma);
export const groupsReader: GroupsReader = new PrismaGroupsReader(prisma);
export const groupSetReader: GroupSetReader = new PrismaGroupSetReader(prisma);
export const groupSetWriter: GroupSetWriter = new PrismaGroupSetWriter(prisma);