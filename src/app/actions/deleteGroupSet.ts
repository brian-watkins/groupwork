"use server"

import { groupSetWriter, teacherAuth } from "@/app/app-config"
import { GroupSet } from "@/domain/groupSet"
import { deleteGroupSet } from "@/domain/deleteGroupSet"
import { ResultType } from "@/domain/result"
import { toTeacher } from "@/lib/domainHelpers"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { unauthorized } from "next/navigation"
import { DisplayableGroupSet } from "../courses/[courseId]/groups/components/DisplayableGroupSet"
import { DateTime } from "luxon"

export async function deleteGroupSetAction(
  displayableGroupSet: DisplayableGroupSet,
): Promise<void> {
  const user = await currentUser()

  if (!user) {
    unauthorized()
  }

  const groupSet: GroupSet = {
    ...displayableGroupSet,
    createdAt: DateTime.fromISO(displayableGroupSet.createdAt),
  }

  const result = await deleteGroupSet(
    teacherAuth,
    groupSetWriter,
    toTeacher(user),
    groupSet,
  )

  if (result.type === ResultType.ERROR) {
    return unauthorized()
  }

  revalidatePath(`/courses/${groupSet.courseId}/groups`)
}
