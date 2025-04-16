import { DateTime } from "luxon"
import { CourseId } from "./course"
import { Group } from "./group"
import { GroupSet } from "./groupSet"

export interface GroupSetDetails {
  courseId: CourseId
  name: string
  createdAt?: DateTime
  groups: Array<Group>
}

export interface GroupSetWriter {
  create(details: GroupSetDetails): Promise<GroupSet>
  save(groupSet: GroupSet): Promise<void>
  delete(groupSet: GroupSet): Promise<void>
}
