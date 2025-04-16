import { Group } from "./group"
import { DateTime } from "luxon"
import { CourseId } from "./course"

export type GroupSetId = string

export interface GroupSet {
  id: GroupSetId
  name: string
  courseId: CourseId
  groups: Array<Group>
  createdAt: DateTime
}
