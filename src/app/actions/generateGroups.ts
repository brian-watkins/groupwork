'use server';

import { courseReader, groupsReader } from "@/app/app-config";
import { assignGroups } from "@/domain/assignGroups";
import { CourseId } from "@/domain/course";
import { Group } from "@/domain/group";
import { ResultType } from "@/domain/result";
import { toTeacher } from "@/lib/domainHelpers";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, unauthorized } from "next/navigation";

export async function generateGroups(courseId: CourseId, size: number = 2): Promise<Group[]> {
  const user = await currentUser()

  if (!user) {
    unauthorized()
  }

  const result = await assignGroups(toTeacher(user),
    courseReader,
    groupsReader,
    { courseId, size }
  )

  if (result.type === ResultType.ERROR) {
    notFound()
  }

  return result.value
}
