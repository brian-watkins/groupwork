import { PrismaCourseReader } from "@/infrastructure/prismaCourseReader";
import { PrismaGroupsReader } from "@/infrastructure/prismaGroupsReader";
import { PrismaGroupSetReader } from "@/infrastructure/prismaGroupSetReader";
import { PrismaGroupSetWriter } from "@/infrastructure/prismaGroupSetWriter";
import { prisma } from "@/lib/prisma";

export const courseReader = new PrismaCourseReader(prisma);
export const groupsReader = new PrismaGroupsReader(prisma);
export const groupSetReader = new PrismaGroupSetReader(prisma);
export const groupSetWriter = new PrismaGroupSetWriter(prisma);