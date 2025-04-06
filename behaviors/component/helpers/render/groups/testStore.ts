import type { GroupStore, GroupStoreState } from "@/app/stores/groupStore"
import { Group } from "@/domain/group"
import { create } from "zustand"

window.calledRecordGroups = 0

export function createTestStore(overrides: Partial<GroupStoreState>) {
  return create<GroupStore>((set, get) => ({
    newGroups: [],
    groupSets: [],
    ...overrides,
    setGroupsForGroupSet(groupSetId, groups) {
      set({ newGroups: groups })
    },
    async assignGroups(course, groupSize) {
      return new Promise<void>(resolve => {
        window.resolveAssignGroups = (groups: Array<Group>) => {
          set({ newGroups: groups })
          resolve()
        }
      })
    },
    async recordGroups(course, name) {
      window.calledRecordGroups++
      return new Promise<void>(resolve => {
        window.resolveRecordGroups = resolve as () => {}
      })
    },
  }))
}