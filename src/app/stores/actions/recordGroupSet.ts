'use server';

import { groupSetWriter } from "@/app/app-config";
import { DisplayableGroupSet, toDisplayableGroupSet } from "@/app/courses/[courseId]/groups/components/DisplayableGroupSet";
import { CourseId } from "@/domain/course";
import { Group } from "@/domain/group";
import { DateTime } from "luxon";
import { revalidatePath } from "next/cache";

export async function recordGroupSet(
  courseId: CourseId,
  name: string,
  groups: Group[]
): Promise<DisplayableGroupSet> {
  try {
    const newGroupSet = await groupSetWriter.create({
      courseId: courseId,
      name,
      groups,
      createdAt: DateTime.now()
    });

    const displayableGroupSet = toDisplayableGroupSet(newGroupSet);

    revalidatePath(`/courses/${courseId}`);

    return displayableGroupSet;
  } catch (error) {
    console.error("Error recording group set:", error);
    throw error;
  }
}
