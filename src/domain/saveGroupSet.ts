import { GroupSet } from "./groupSet";
import { GroupSetWriter } from "./groupSetWriter";
import { errorResult, okResult, Result } from "./result";
import { Teacher } from "./teacher";
import { TeacherAuthorization } from "./teacherReader";

export enum UpdateGroupSetError {
  Unauthorized
}

export async function saveGroupSet(
  teacherAuth: TeacherAuthorization,
  groupSetWriter: GroupSetWriter,
  teacher: Teacher,
  groupSet: GroupSet
): Promise<Result<GroupSet, UpdateGroupSetError>> {
  const canManageCourse = await teacherAuth.canManageCourse(teacher, groupSet.courseId);

  if (!canManageCourse) {
    return errorResult(UpdateGroupSetError.Unauthorized);
  }

  await groupSetWriter.save(groupSet);
  
  return okResult(groupSet);
}