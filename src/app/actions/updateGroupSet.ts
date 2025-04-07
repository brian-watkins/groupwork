'use server';

import { groupSetWriter, teacherAuth } from "@/app/app-config";
import { DisplayableGroupSet } from "@/app/courses/[courseId]/groups/components/DisplayableGroupSet";
import { saveGroupSet } from "@/domain/saveGroupSet";
import { ResultType } from "@/domain/result";
import { toTeacher } from "@/lib/domainHelpers";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { unauthorized } from "next/navigation";
import { DateTime } from "luxon";
import { GroupSet } from "@/domain/groupSet";

export async function updateGroupSet(
  displayableGroupSet: DisplayableGroupSet
): Promise<void> {
  const user = await currentUser();

  if (!user) {
    return unauthorized();
  }

  const groupSet: GroupSet = {
    ...displayableGroupSet,
    createdAt: DateTime.fromISO(displayableGroupSet.createdAt)
  };

  const updateResult = await saveGroupSet(
    teacherAuth,
    groupSetWriter,
    toTeacher(user),
    groupSet
  );

  if (updateResult.type === ResultType.ERROR) {
    return unauthorized();
  }

  revalidatePath(`/courses/${groupSet.courseId}`);
}