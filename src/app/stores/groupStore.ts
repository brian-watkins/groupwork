'use client';

import { create } from 'zustand'
import { Group } from '../../domain/group'
import { Course } from '@/domain/course'
import { DisplayableGroupSet } from '../courses/[courseId]/groups/components/DisplayableGroupSet'
import { generateGroups } from './actions/generateGroups';
import { recordGroupSet } from './actions/recordGroupSet';
import { GroupSetId } from '@/domain/groupSet';

export interface GroupStoreState {
  newGroups: Group[]
  groupSets: DisplayableGroupSet[]
  setGroupsForGroupSet: (groupSetId: GroupSetId | undefined, groups: Array<Group>) => void
}

interface GroupActions {
  assignGroups: (course: Course, groupSize: number) => Promise<void>
  recordGroups: (course: Course, name: string) => Promise<void>
}

export type GroupStore = GroupStoreState & GroupActions

export const createGroupStore = (initialState: Partial<GroupStoreState> = {}) => {
  return create<GroupStore>((set, get) => ({
    newGroups: [],
    groupSets: [],
    ...initialState,

    setGroupsForGroupSet: (groupSetId: GroupSetId | undefined, groups: Array<Group>) => {
      if (groupSetId !== undefined) {
        set({
          groupSets: get().groupSets.map(set => {
            if (set.id === groupSetId) {
              return { ...set, groups }
            } else {
              return set
            }
          })
        })
      } else {
        set({ newGroups: groups })
      }
    },

    assignGroups: async (course: Course, groupSize: number) => {
      try {
        const generatedGroups = await generateGroups(course.id, groupSize)
        set({ newGroups: generatedGroups })
      } catch (error) {
        console.log("Error assigning groups", error)
      }
    },

    recordGroups: async (course: Course, name: string) => {
      try {
        const newGroupSet = await recordGroupSet(course.id, name, get().newGroups)
        set((store) => {
          return {
            newGroups: [],
            groupSets: [newGroupSet, ...store.groupSets]
          }
        })
      } catch (error) {
        console.log("Error recording groups", error)
      }
    }
  }))

}