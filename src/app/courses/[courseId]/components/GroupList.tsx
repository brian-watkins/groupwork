'use client';

import { Group } from "@/domain/group";

interface GroupListProps {
  groups: Group[];
}

export default function GroupList({ groups }: GroupListProps) {
  return (
    <div data-groups className="space-y-6">
      {groups.map((group, index) => {
        const groupMembers = Array.from(group.members);

        return (
          <div
            key={index}
            data-student-group
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            <h3 className="font-medium text-lg mb-2">Group {index + 1}</h3>

            <ul className="divide-y divide-gray-200">
              {groupMembers.map(student => (
                <li
                  key={student.id}
                  data-group-member
                  className="py-3"
                >
                  <div data-student-name className="font-medium">{student.name}</div>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  );
}
