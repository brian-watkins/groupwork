'use client';

import { DisplayableGroupSet } from "./DisplayableGroupSet";
import { useState } from "react";
import GroupList from "./GroupList";
import { DateTime } from "luxon";
import { useGroupStore } from "@/app/contexts/GroupStoreContext";
import GroupSetForm from "./GroupSetForm";

interface GroupSetProps {
  groupSet: DisplayableGroupSet
  expanded: boolean
}

export default function GroupSetList() {
  const groupSets = useGroupStore(store => store.groupSets)

  return (
    <>
      {groupSets.map((groupSet, index) =>
        <GroupSet
          key={groupSet.id}
          groupSet={groupSet}
          expanded={index === 0}
        />
      )}
    </>
  )
}

function GroupSet({ groupSet, expanded }: GroupSetProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isEditing, setIsEditing] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
  };

  const formatDate = (date: string) => {
    return `Created ${DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}`;
  };

  return (
    <div
      data-group-set
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-shadow"
    >
      <div className="flex justify-between items-center">
        <div className="cursor-pointer flex-grow" onClick={toggleExpand}>
          <h3 data-group-set-name className="text-lg font-semibold">{groupSet.name}</h3>
          <p data-group-set-created-at className="text-sm text-gray-500">
            {formatDate(groupSet.createdAt)}
          </p>
        </div>
        <div className="flex items-center">
          <button
            data-edit-group-set-button
            onClick={handleEdit}
            className="mr-2 text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          <div className="text-blue-600 cursor-pointer" onClick={toggleExpand}>{isExpanded ? "▲" : "▼"}</div>
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
            <GroupSetForm
              onClose={handleCloseForm}
              groupSetToEdit={groupSet}
            />
          </div>
        </div>
      )}
    </div>
  );
}