"use client"

import { create } from "zustand"
import { Group } from "../../domain/group"
import { Course } from "@/domain/course"
import { DisplayableGroupSet } from "../courses/[courseId]/groups/components/DisplayableGroupSet"
import { generateGroups } from "../actions/generateGroups"
import { recordGroupSet } from "../actions/recordGroupSet"
import { updateGroupSet as updateGroupSetAction } from "../actions/updateGroupSet"
import { deleteGroupSetAction } from "../actions/deleteGroupSet"
import { GroupSetId } from "@/domain/groupSet"

export interface GroupStoreState {
  course: Course
  newGroups: Group[]
  groupSets: DisplayableGroupSet[]
  setGroupsForGroupSet: (
    groupSetId: GroupSetId | undefined,
    groups: Array<Group>,
  ) => void
  courseSize: number
}

interface GroupActions {
  assignGroups: (groupSize: number) => Promise<void>
  recordGroups: (name: string) => Promise<void>
  updateGroupSet: (groupSet: DisplayableGroupSet) => Promise<void>
  deleteGroupSet: (groupSet: DisplayableGroupSet) => Promise<void>
}

export type GroupStore = GroupStoreState & GroupActions

export const createGroupStore = (
  initialState: Partial<GroupStoreState> & { course: Course },
) => {
  return create<GroupStore>((set, get) => ({
    newGroups: [],
    groupSets: [],
    ...initialState,

    courseSize: initialState.course.students.length,

    setGroupsForGroupSet: (
      groupSetId: GroupSetId | undefined,
      groups: Array<Group>,
    ) => {
      if (groupSetId !== undefined) {
        set({
          groupSets: get().groupSets.map((set) => {
            if (set.id === groupSetId) {
              return { ...set, groups }
            } else {
              return set
            }
          }),
        })
      } else {
        set({ newGroups: groups })
      }
    },

    assignGroups: async (groupSize: number) => {
      try {
        const generatedGroups = await generateGroups(get().course.id, groupSize)
        set({ newGroups: generatedGroups })
      } catch (error) {
        console.log("Error assigning groups", error)
      }
    },

    recordGroups: async (name: string) => {
      try {
        const newGroupSet = await recordGroupSet(
          get().course.id,
          name,
          get().newGroups,
        )
        set((store) => {
          return {
            newGroups: [],
            groupSets: [newGroupSet, ...store.groupSets],
          }
        })
      } catch (error) {
        console.log("Error recording groups", error)
      }
    },

    updateGroupSet: async (groupSet: DisplayableGroupSet) => {
      try {
        await updateGroupSetAction(groupSet)

        set((store) => {
          const groupSets = store.groupSets.map((gs) =>
            gs.id === groupSet.id ? groupSet : gs,
          )

          return {
            groupSets,
          }
        })
      } catch (error) {
        console.log("Error updating group set", error)
      }
    },

    deleteGroupSet: async (groupSet: DisplayableGroupSet) => {
      try {
        await deleteGroupSetAction(groupSet)

        set((store) => {
          return {
            groupSets: store.groupSets.filter((gs) => gs.id !== groupSet.id),
          }
        })
      } catch (error) {
        console.log("Error deleting group set", error)
      }
    },
  }))
}
