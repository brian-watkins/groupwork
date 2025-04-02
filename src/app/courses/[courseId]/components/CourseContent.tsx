'use client';

import { Course, CourseId } from "@/domain/course";
import { Group, isValidGroupSize } from "@/domain/group";
import { Student } from "@/domain/student";
import { useState, useEffect } from "react";
import { generateGroups } from "../actions/generateGroups";
import { recordGroupSet } from "../actions/recordGroupSet";
import { DisplayableGroupSet } from "./DisplayableGroupSet";
import GroupSetForm from "./GroupSetForm";
import GroupSet from "./GroupSet";

interface CourseContentProps {
  course: Course
  groupSets: DisplayableGroupSet[];
}

export default function CourseContent({ course, groupSets }: CourseContentProps) {
  const defaultGroups = [{ members: new Set(course.students) }]

  const [groups, setGroups] = useState<Group[]>(defaultGroups);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState<number>(2);
  const [lastRecordedGroupSet, setLastRecordedGroupSet] = useState<string | null>(null);
  const [allGroupSets, setAllGroupSets] = useState<DisplayableGroupSet[]>(groupSets);

  const handleAssignGroups = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const newGroups = await generateGroups(course.id, groupSize)

      setGroups(newGroups)
    } catch (error) {
      console.error('Error assigning groups:', error);
      setError(error instanceof Error ? error.message : 'Failed to assign groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && isValidGroupSize(value, course.students.length)) {
      setGroupSize(value);
    }
  };

  useEffect(() => {
    setAllGroupSets(groupSets);
  }, [groupSets]);

  const handleRecordGroups = async (groupSetName: string) => {
    try {
      setIsRecording(true);
      setError(null);

      const newGroupSet = await recordGroupSet(course.id, groupSetName, groups);

      setLastRecordedGroupSet(groupSetName);
      setAllGroupSets(prevGroupSets => [newGroupSet, ...prevGroupSets]);
    } catch (error) {
      console.error('Error recording group set:', error);
      setError(error instanceof Error ? error.message : 'Failed to record group set');
    } finally {
      setIsRecording(false);
    }
  };

  if (isLoading) {
    return <div className="mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="mt-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Group Sets</h2>
        {course.students.length >= 2 && (
          <div data-group-size-container className="border border-gray-300 p-4 rounded-md flex items-center gap-4">
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
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Assigning...' : 'Assign to Groups'}
            </button>
          </div>
        )}
      </div>

      {lastRecordedGroupSet && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          Group set "{lastRecordedGroupSet}" has been recorded successfully!
        </div>
      )}

      <div className="space-y-4">
        <GroupSetForm
          groups={groups}
          onRecordGroups={handleRecordGroups}
          isRecording={isRecording}
        />

        {allGroupSets.map((groupSet) => (
          <GroupSet
            key={groupSet.id}
            groupSet={groupSet}
          />
        ))}
      </div>
    </div>
  );
}