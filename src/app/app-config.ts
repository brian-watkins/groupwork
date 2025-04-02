import { PrismaCourseReader } from "@/domain/infrastructure/prismaCourseReader";
import { PrismaGroupsReader } from "@/domain/infrastructure/prismaGroupsReader";
import { PrismaGroupSetReader } from "@/domain/infrastructure/prismaGroupSetReader";
import { PrismaGroupSetWriter } from "@/domain/infrastructure/prismaGroupSetWriter";
import { prisma } from "@/lib/prisma";

export const courseReader = new PrismaCourseReader(prisma);
export const groupsReader = new PrismaGroupsReader(prisma);
export const groupSetReader = new PrismaGroupSetReader(prisma);
export const groupSetWriter = new PrismaGroupSetWriter(prisma);