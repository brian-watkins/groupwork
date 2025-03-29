import { CourseId } from "./course";
import { Group } from "./group";

export interface GroupsReader {
  get(courseId: CourseId): Promise<Array<Group>>
}
