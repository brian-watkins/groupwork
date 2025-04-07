import { CourseReader } from "./courseReader";
import { GroupSet } from "./groupSet";
import { GroupSetDetails, GroupSetWriter } from "./groupSetWriter";
import { errorResult, okResult, Result } from "./result";
import { Teacher } from "./teacher";
import { TeacherAuthorization } from "./teacherReader";

export enum GroupSetError {
  Unauthorized
}

export async function createGroupSet(
  teacherAuth: TeacherAuthorization,
  groupSetWriter: GroupSetWriter,
  teacher: Teacher,
  details: GroupSetDetails
): Promise<Result<GroupSet, GroupSetError>> {
  const canManageCourse = await teacherAuth.canManageCourse(teacher, details.courseId)

  if (!canManageCourse) {
    return errorResult(GroupSetError.Unauthorized)
  }

  const groupSet = await groupSetWriter.create(details)
  return okResult(groupSet)
}