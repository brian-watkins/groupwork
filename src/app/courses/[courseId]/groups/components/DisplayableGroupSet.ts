import { CourseId } from "@/domain/course"
import { Group } from "@/domain/group"
import { GroupSet, GroupSetId } from "@/domain/groupSet"

export interface DisplayableGroupSet {
  id: GroupSetId
  name: string
  courseId: CourseId
  groups: Array<Group>
  createdAt: string
}

export function toDisplayableGroupSet(groupSet: GroupSet): DisplayableGroupSet {
  return {
    ...groupSet,
    createdAt: groupSet.createdAt.toISO() ?? "",
  }
}

export function toDisplayableGroupSets(
  groupSets: GroupSet[],
): DisplayableGroupSet[] {
  return groupSets.map(toDisplayableGroupSet)
}
