import { CourseId } from "./course";
import { Teacher } from "./teacher";

export interface TeacherAuthorization {
  canManageCourse(teacher: Teacher, courseId: CourseId): Promise<boolean>
}