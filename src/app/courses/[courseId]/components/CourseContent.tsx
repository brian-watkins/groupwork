'use client';

import { CourseId } from "@/domain/course";
import { Group } from "@/domain/group";
import { Student } from "@/domain/student";
import { useState } from "react";
import GroupList from "./GroupList";
import { assignGroups } from "../actions/assign-groups";

interface CourseContentProps {
  courseId: CourseId;
  students: Student[];
}

export default function CourseContent({ courseId, students }: CourseContentProps) {
  const defaultGroups = [{ members: new Set(students) }]

  const [groups, setGroups] = useState<Group[]>(defaultGroups);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssignGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the server action to assign groups
      const newGroups = await assignGroups(courseId, 2);

      // Update state with the new groups
      setGroups(newGroups);
    } catch (error) {
      console.error('Error assigning groups:', error);
      setError(error instanceof Error ? error.message : 'Failed to assign groups');
    } finally {
      setIsLoading(false);
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
          <button
            data-testid="assign-groups-button"
            onClick={handleAssignGroups}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Assigning...' : 'Assign to Groups'}
          </button>
        )}
      </div>

      <GroupList groups={groups} />
    </div>
  );
}
