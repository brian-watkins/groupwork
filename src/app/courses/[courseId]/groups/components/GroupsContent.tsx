"use client"

import { Course } from "@/domain/course"
import { DisplayableGroupSet } from "./DisplayableGroupSet"
import { GroupStoreProvider } from "@/app/contexts/GroupStoreContext"
import { createGroupStore } from "@/app/stores/groupStore"
import GroupSetList from "./GroupSetList"
import { useState } from "react"
import GroupSetFormModal from "./GroupSetFormModal"
import { Button } from "react-aria-components"
import CourseBreadcrumbs from "./CourseBreadcrumbs"

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
          <CourseBreadcrumbs course={course} />
          <Button
            data-create-new-groups-button
            onPress={() => setShowGroupSetForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm"
          >
            Create New Groups
          </Button>
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
