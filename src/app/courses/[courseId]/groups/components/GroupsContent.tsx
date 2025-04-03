'use client';

import { Course } from "@/domain/course";
import { DisplayableGroupSet } from "./DisplayableGroupSet";
import GroupSetForm from "./GroupSetForm";
import { GroupStoreProvider } from "@/app/contexts/GroupStoreContext";
import { createGroupStore } from "@/app/stores/groupStore";
import GroupSetList from "./GroupSetList";

interface GroupsContentProps {
  course: Course
  groupSets: DisplayableGroupSet[];
}

export default function GroupsContent({ course, groupSets }: GroupsContentProps) {
  return (
    <GroupStoreProvider store={createGroupStore({ groups: [{ members: new Set(course.students) }], groupSets })}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Group Sets</h2>
        </div>
        <div className="space-y-4">
          <GroupSetForm
            course={course}
          />
          <GroupSetList />
        </div>
      </div>
    </GroupStoreProvider>
  );
}