"use client"

import { DisplayableGroupSet } from "./DisplayableGroupSet"
import { useState } from "react"
import GroupList from "./GroupList"
import { DateTime } from "luxon"
import { useGroupStore } from "@/app/contexts/GroupStoreContext"
import GroupSetForm from "./GroupSetForm"
import { Pencil, Trash2, PanelBottomClose, PanelBottomOpen } from "lucide-react"

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
        <div className="cursor-pointer flex-grow" onClick={toggleExpand}>
          <h3 data-group-set-name className="text-lg font-semibold">
            {groupSet.name}
          </h3>
          <p data-group-set-created-at className="text-sm text-gray-500">
            {formatDate(groupSet.createdAt)}
          </p>
        </div>
        <div className="flex items-center">
          <button
            data-edit-group-set-button
            onClick={handleEdit}
            className="mr-2 text-blue-600 hover:text-blue-800"
            aria-label="Edit group set"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            data-delete-group-set-button
            onClick={handleDeleteClick}
            className="mr-2 text-red-600 hover:text-red-800"
            aria-label="Delete group set"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <div
            className="text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <PanelBottomOpen className="w-5 h-5" />
            ) : (
              <PanelBottomClose className="w-5 h-5" />
            )}
          </div>
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
        <div
          data-testid="delete-group-set-confirmation"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Group Set</h3>
            <p data-confirmation-message className="mb-6">
              Are you sure you want to delete the group set &quot;
              {groupSet.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                data-cancel
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                data-delete
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
