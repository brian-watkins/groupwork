'use client';

import { CourseId } from "@/domain/course";
import { Group, isValidGroupSize } from "@/domain/group";
import { Student } from "@/domain/student";
import { useState } from "react";
import GroupList from "./GroupList";
import { generateGroups } from "../actions/generateGroups";

interface CourseContentProps {
  courseId: CourseId;
  students: Student[];
}

export default function CourseContent({ courseId, students }: CourseContentProps) {
  const defaultGroups = [{ members: new Set(students) }]

  const [groups, setGroups] = useState<Group[]>(defaultGroups);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState<number>(2);

  const handleAssignGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const newGroups = await generateGroups(courseId, groupSize);
      setGroups(newGroups);
    } catch (error) {
      console.error('Error assigning groups:', error);
      setError(error instanceof Error ? error.message : 'Failed to assign groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && isValidGroupSize(value, students.length)) {
      setGroupSize(value);
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
        <h2 className="text-xl font-semibold">Groups</h2>
        {students.length >= 2 && (
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

      <GroupList groups={groups} />
    </div>
  );
}
