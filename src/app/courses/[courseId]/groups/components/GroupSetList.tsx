"use client"

import { DisplayableGroupSet } from "./DisplayableGroupSet"
import { useState } from "react"
import GroupList from "./GroupList"
import { DateTime } from "luxon"
import { useGroupStore } from "@/app/contexts/GroupStoreContext"
import GroupSetForm from "./GroupSetForm"

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
          <button
            data-delete-group-set-button
            onClick={handleDeleteClick}
            className="mr-2 text-red-600 hover:text-red-800"
            aria-label="Delete group set"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
          <div className="text-blue-600 cursor-pointer" onClick={toggleExpand}>
            {isExpanded ? "▲" : "▼"}
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
