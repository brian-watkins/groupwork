import type { GroupStore, GroupStoreState } from "@/app/stores/groupStore"
import { Course } from "@/domain/course"
import { Group } from "@/domain/group"
import { create } from "zustand"

window.calledRecordGroups = 0

export function createTestStore(
  overrides: Partial<GroupStoreState> & { course: Course },
) {
  return create<GroupStore>((set, get) => ({
    newGroups: [],
    groupSets: [],
    ...overrides,
    courseSize: overrides.course.students.length,
    setGroupsForGroupSet(groupSetId, groups) {
      set({ newGroups: groups })
    },
    async assignGroups(groupSize) {
      return new Promise<void>((resolve) => {
        window.resolveAssignGroups = (groups: Array<Group>) => {
          set({ newGroups: groups })
          resolve()
        }
      })
    },
    async recordGroups(name) {
      window.calledRecordGroups++
      return new Promise<void>((resolve) => {
        window.resolveRecordGroups = resolve as () => {}
      })
    },
    async updateGroupSet(groupSet) {},
    async deleteGroupSet(groupSet) {},
  }))
}
