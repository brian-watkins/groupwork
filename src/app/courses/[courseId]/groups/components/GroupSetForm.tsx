'use client';

import { isValidGroupSize } from "@/domain/group";
import GroupList from "./GroupList";
import { useEffect, useState } from "react";
import { useGroupStore } from "@/app/contexts/GroupStoreContext";
import { DisplayableGroupSet } from "./DisplayableGroupSet";

interface GroupSetFormProps {
  onClose: () => void
  groupSetToEdit?: DisplayableGroupSet
}

export default function GroupSetForm({ onClose, groupSetToEdit }: GroupSetFormProps) {
  const [groupSetName, setGroupSetName] = useState(groupSetToEdit?.name || "");
  const [showError, setShowError] = useState(false);
  const [groupSize, setGroupSize] = useState<number>(2);
  const [isRecording, setIsRecording] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isEditMode] = useState(!!groupSetToEdit);

  const courseSize = useGroupStore(store => store.courseSize)
  const assignGroups = useGroupStore(store => store.assignGroups);
  const recordGroups = useGroupStore(store => store.recordGroups);
  const updateGroupSet = useGroupStore(store => store.updateGroupSet);

  useEffect(() => {
    if (groupSetToEdit) {
      setGroupSetName(groupSetToEdit.name || "");
    }
  }, [groupSetToEdit]);

  const handleRecordGroups = async () => {
    if (groupSetName.trim() === "") {
      setShowError(true);
      return;
    }

    setIsRecording(true);

    if (isEditMode && groupSetToEdit) {
      await updateGroupSet({
        ...groupSetToEdit,
        name: groupSetName
      });
    } else {
      await recordGroups(groupSetName);
    }

    setIsRecording(false);
    onClose();
  };

  const handleAssignGroups = async () => {
    setIsAssigning(true);
    await assignGroups(groupSize);
    setIsAssigning(false);
  };

  const handleGroupSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && isValidGroupSize(value, courseSize)) {
      setGroupSize(value);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSetName(e.target.value);
    if (e.target.value.trim() !== "") {
      setShowError(false);
    }
  };

  return (
    <div
      data-group-set-form
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-shadow"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2">
          <input
            type="text"
            data-group-set-name-input
            value={groupSetName}
            onChange={handleNameChange}
            placeholder="New Group Set"
            className={`text-lg w-full px-2 py-1 font-semibold border
              ${showError ? 'border-red-500 bg-red-50' : 'border-gray-200'}
              rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {showError && (
            <p data-input-error className="text-red-500 text-sm mt-1">
              Please enter a name for this group set
            </p>
          )}
        </div>
        {!isEditMode && (
          <div data-group-size-container className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Create groups of</span>
              <input
                data-group-size-input
                type="number"
                value={groupSize}
                onChange={handleGroupSizeChange}
                className="w-16 border border-gray-300 rounded px-2 py-1"
              />
              <span>members</span>
            </div>
            <button
              data-assign-groups-button
              onClick={handleAssignGroups}
              disabled={isAssigning}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign to Groups
            </button>
          </div>
        )}
      </div>
      {!isEditMode ? <GroupList /> : <GroupList groupSetId={groupSetToEdit?.id} editable={true} />}
      <div className="flex justify-between mt-4">
        <button
          data-cancel-button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm"
        >
          Cancel
        </button>
        <button
          data-record-groups-button
          onClick={handleRecordGroups}
          disabled={isRecording}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditMode ? "Save Changes" : "Record Groups"}
        </button>
      </div>
    </div>
  );
}