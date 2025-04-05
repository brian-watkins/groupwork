import { PrismaCourseReader } from "@/infrastructure/prismaCourseReader";
import { PrismaCourseWriter } from "@/infrastructure/prismaCourseWriter";
import { PrismaGroupsReader } from "@/infrastructure/prismaGroupsReader";
import { PrismaGroupSetReader } from "@/infrastructure/prismaGroupSetReader";
import { PrismaGroupSetWriter } from "@/infrastructure/prismaGroupSetWriter";
import { prisma } from "@/lib/prisma";

export const courseReader = new PrismaCourseReader(prisma);
export const courseWriter = new PrismaCourseWriter(prisma);
export const groupsReader = new PrismaGroupsReader(prisma);
export const groupSetReader = new PrismaGroupSetReader(prisma);
export const groupSetWriter = new PrismaGroupSetWriter(prisma);