"use server"

import { groupSetWriter, teacherAuth } from "@/app/app-config"
import {
  DisplayableGroupSet,
  toDisplayableGroupSet,
} from "@/app/courses/[courseId]/groups/components/DisplayableGroupSet"
import { CourseId } from "@/domain/course"
import { createGroupSet } from "@/domain/createGroupSet"
import { Group } from "@/domain/group"
import { ResultType } from "@/domain/result"
import { toTeacher } from "@/lib/domainHelpers"
import { currentUser } from "@clerk/nextjs/server"
import { DateTime } from "luxon"
import { revalidatePath } from "next/cache"
import { unauthorized } from "next/navigation"

export async function recordGroupSet(
  courseId: CourseId,
  name: string,
  groups: Group[],
): Promise<DisplayableGroupSet> {
  const user = await currentUser()

  if (!user) {
    unauthorized()
  }

  const newGroupSetResult = await createGroupSet(
    teacherAuth,
    groupSetWriter,
    toTeacher(user),
    {
      courseId: courseId,
      name,
      groups,
      createdAt: DateTime.now(),
    },
  )

  if (newGroupSetResult.type === ResultType.ERROR) {
    return unauthorized()
  }

  const displayableGroupSet = toDisplayableGroupSet(newGroupSetResult.value)

  revalidatePath(`/courses/${courseId}`)

  return displayableGroupSet
}
