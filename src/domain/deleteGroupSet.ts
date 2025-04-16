import { GroupSet } from "./groupSet"
import { GroupSetWriter } from "./groupSetWriter"
import { errorResult, okResult, Result } from "./result"
import { Teacher } from "./teacher"
import { TeacherAuthorization } from "./teacherReader"

export enum DeleteGroupSetError {
  Unauthorized,
}

export async function deleteGroupSet(
  teacherAuth: TeacherAuthorization,
  groupSetWriter: GroupSetWriter,
  teacher: Teacher,
  groupSet: GroupSet,
): Promise<Result<boolean, DeleteGroupSetError>> {
  const canManageCourse = await teacherAuth.canManageCourse(
    teacher,
    groupSet.courseId,
  )

  if (!canManageCourse) {
    return errorResult(DeleteGroupSetError.Unauthorized)
  }

  await groupSetWriter.delete(groupSet)

  return okResult(true)
}
