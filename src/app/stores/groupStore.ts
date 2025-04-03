'use client';

import { create } from 'zustand'
import { Group } from '../../domain/group'
import { Course } from '@/domain/course'
import { DisplayableGroupSet } from '../courses/[courseId]/groups/components/DisplayableGroupSet'
import { generateGroups } from './actions/generateGroups';
import { recordGroupSet } from './actions/recordGroupSet';

export interface GroupStoreState {
  groups: Group[]
  groupSets: DisplayableGroupSet[]
}

interface GroupActions {
  assignGroups: (course: Course, groupSize: number) => Promise<void>
  recordGroups: (course: Course, name: string, groups: Group[]) => Promise<void>
}

export type GroupStore = GroupStoreState & GroupActions

export const createGroupStore = (initialState: Partial<GroupStoreState> = {}) => {
  return create<GroupStore>((set, get) => ({
    groups: [],
    groupSets: [],
    ...initialState,

    assignGroups: async (course: Course, groupSize: number) => {
      try {
        const generatedGroups = await generateGroups(course.id, groupSize)
        set({ groups: generatedGroups })
      } catch (error) {
        console.log("Error assigning groups", error)
      }
    },

    recordGroups: async (course: Course, name: string, groups: Group[]) => {
      try {
        const newGroupSet = await recordGroupSet(course.id, name, groups)
        set((store) => {
          return { groupSets: [newGroupSet, ...store.groupSets] }
        })
      } catch (error) {
        console.log("Error recording groups", error)
      }
    }
  }))

}