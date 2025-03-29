import { PrismaCourseReader } from "@/domain/infrastructure/prismaCourseReader";
import { prisma } from "@/lib/prisma";

export const courseReader = new PrismaCourseReader(prisma);