'use client';

import { Group } from "@/domain/group";
import GroupList from "./GroupList";
import { useState } from "react";

interface GroupSetFormProps {
  groups: Group[];
  onRecordGroups: (name: string) => void;
  isRecording: boolean;
}

export default function GroupSetForm({ groups, onRecordGroups, isRecording }: GroupSetFormProps) {
  const [groupSetName, setGroupSetName] = useState("");
  const [showError, setShowError] = useState(false);

  const handleRecordClick = () => {
    if (groupSetName.trim() === "") {
      setShowError(true);
      return;
    }

    onRecordGroups(groupSetName);
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
        <button
          data-record-groups-button
          onClick={handleRecordClick}
          disabled={isRecording}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRecording ? 'Recording...' : 'Record Groups'}
        </button>
      </div>

      <GroupList groups={groups} />
    </div>
  );
}