import { PrismaCourseReader } from "@/domain/infrastructure/prismaCourseReader";
import { PrismaGroupsReader } from "@/domain/infrastructure/prismaGroupsReader";
import { prisma } from "@/lib/prisma";

export const courseReader = new PrismaCourseReader(prisma);
export const groupsReader = new PrismaGroupsReader(prisma);