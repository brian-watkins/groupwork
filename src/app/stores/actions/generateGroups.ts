'use server';

import { courseReader, groupsReader } from "@/app/app-config";
import { assignGroups } from "@/domain/assignGroups";
import { CourseId } from "@/domain/course";
import { Group } from "@/domain/group";
import { toTeacher } from "@/lib/domainHelpers";
import { currentUser } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";

export async function generateGroups(courseId: CourseId, size: number = 2): Promise<Group[]> {
  const user = await currentUser()

  if (!user) {
    return unauthorized()
  }

  try {
    return await assignGroups(toTeacher(user),
      courseReader,
      groupsReader,
      { courseId, size }
    );
  } catch (error) {
    console.error('Error creating groups:', error);
    throw new Error('Failed to create groups');
  }
}
