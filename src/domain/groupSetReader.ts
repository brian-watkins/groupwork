import { GroupSet } from "./groupSet";
import { CourseId } from "./course";

export interface GroupSetReader {
  getByCourse(courseId: CourseId): Promise<Array<GroupSet>>
}