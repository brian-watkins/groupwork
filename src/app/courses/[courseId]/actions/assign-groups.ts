'use server';

import { courseReader, groupsReader } from "@/app/app-config";
import { chooseGroups } from "@/domain/chooseGroups";
import { CourseId } from "@/domain/course";
import { Group } from "@/domain/group";

export async function assignGroups(courseId: CourseId, size: number = 2): Promise<Group[]> {
  try {
    return await chooseGroups(
      courseReader,
      groupsReader,
      { courseId, size }
    );
  } catch (error) {
    console.error('Error creating groups:', error);
    throw new Error('Failed to create groups');
  }
}
