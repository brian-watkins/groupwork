import { GroupSetId } from "@/domain/groupSet"
import type { GroupStore } from "./groupStore"
import { Group } from "@/domain/group"

export function getGroups(
  groupSetId?: GroupSetId,
): (store: GroupStore) => Array<Group> {
  return (store) => {
    if (groupSetId !== undefined) {
      return store.groupSets.find((set) => set.id === groupSetId)!.groups!
    } else {
      return store.newGroups
    }
  }
}
