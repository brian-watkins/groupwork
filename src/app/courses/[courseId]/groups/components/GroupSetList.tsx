"use client"

import { DisplayableGroupSet } from "./DisplayableGroupSet"
import { useState } from "react"
import GroupList from "./GroupList"
import { DateTime } from "luxon"
import { useGroupStore } from "@/app/contexts/GroupStoreContext"
import GroupSetForm from "./GroupSetForm"
import { PanelBottomClose, PanelBottomOpen } from "lucide-react"
import { Button } from "react-aria-components"
import { ConfirmationModal } from "@/app/components/ConfirmationModal"

interface GroupSetProps {
  groupSet: DisplayableGroupSet
  expanded: boolean
}

export default function GroupSetList() {
  const groupSets = useGroupStore((store) => store.groupSets)

  return (
    <>
      {groupSets.map((groupSet, index) => (
        <GroupSet
          key={groupSet.id}
          groupSet={groupSet}
          expanded={index === 0}
        />
      ))}
    </>
  )
}

function GroupSet({ groupSet, expanded }: GroupSetProps) {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const deleteGroupSet = useGroupStore((store) => store.deleteGroupSet)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCloseForm = () => {
    setIsEditing(false)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
  }

  const handleConfirmDelete = async () => {
    await deleteGroupSet(groupSet)
    setShowDeleteConfirmation(false)
  }

  const formatDate = (date: string) => {
    return `Created ${DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}`
  }

  return (
    <div
      data-group-set
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-shadow"
    >
      <div className="flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={toggleExpand}
        >
          <div className="text-blue-600 mr-3 hover:text-blue-800 flex items-center">
            {isExpanded ? (
              <PanelBottomOpen className="w-8 h-8" strokeWidth={1} />
            ) : (
              <PanelBottomClose className="w-8 h-8" strokeWidth={1} />
            )}
          </div>
          <div>
            <h3 data-group-set-name className="text-lg font-semibold">
              {groupSet.name}
            </h3>
            <p data-group-set-created-at className="text-sm text-gray-500">
              {formatDate(groupSet.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            data-edit-group-set-button
            onPress={handleEdit}
            className="px-3 py-1.5 text-blue-600 border border-blue-600 hover:text-white hover:bg-blue-600 rounded-md transition-colors"
            aria-label="Edit group set"
          >
            Edit
          </Button>
          <Button
            data-delete-group-set-button
            onPress={handleDeleteClick}
            className="px-3 py-1.5 text-red-600 border border-red-600 hover:text-white hover:bg-red-600 rounded-md transition-colors"
            aria-label="Delete group set"
          >
            Delete
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <GroupList groupSetId={groupSet.id} editable={false} />
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-4xl">
            <GroupSetForm onClose={handleCloseForm} groupSetToEdit={groupSet} />
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <ConfirmationModal
          testId="delete-group-set-confirmation"
          title="Delete Group Set"
          message={
            <>
              Are you sure you want to delete the group set &quot;
              {groupSet.name}&quot;? This action cannot be undone.
            </>
          }
          confirmButtonText="Delete"
          isOpen={showDeleteConfirmation}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
