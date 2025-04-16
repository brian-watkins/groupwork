"use client"

import { Course } from "@/domain/course"
import { DisplayableGroupSet } from "./DisplayableGroupSet"
import { GroupStoreProvider } from "@/app/contexts/GroupStoreContext"
import { createGroupStore } from "@/app/stores/groupStore"
import GroupSetList from "./GroupSetList"
import { useState } from "react"
import GroupSetFormModal from "./GroupSetFormModal"

interface GroupsContentProps {
  course: Course
  groupSets: DisplayableGroupSet[]
}

export default function GroupsContent({
  course,
  groupSets,
}: GroupsContentProps) {
  const [showGroupSetForm, setShowGroupSetForm] = useState(false)

  return (
    <GroupStoreProvider
      store={createGroupStore({
        course,
        newGroups: [{ members: new Set(course.students) }],
        groupSets,
      })}
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Group Sets</h2>
          <button
            data-create-new-groups-button
            onClick={() => setShowGroupSetForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm"
          >
            Create New Groups
          </button>
        </div>

        {showGroupSetForm && (
          <GroupSetFormModal onClose={() => setShowGroupSetForm(false)} />
        )}

        <div className="space-y-4">
          <GroupSetList />
        </div>
      </div>
    </GroupStoreProvider>
  )
}
