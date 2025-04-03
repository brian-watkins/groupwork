import GroupSetForm from "@/app/courses/[courseId]/groups/components/GroupSetForm";
import { Group } from "@/domain/group";
import { createRoot } from 'react-dom/client';
import "@/app/globals.css";
import { GroupStoreProvider } from "@/app/contexts/GroupStoreContext";
import { Course } from "@/domain/course";
import type { GroupStore, GroupStoreState } from "@/app/stores/groupStore";
import { create } from "zustand";

window.calledRecordGroups = 0

export function render(
  course: Course,
  groups: Array<Group>,
) {
  const elementRoot = document.createElement("div");
  document.body.appendChild(elementRoot);
  const root = createRoot(elementRoot);

  const testGroupStore = createTestStore({ groups })

  root.render(
    <GroupStoreProvider store={testGroupStore}>
      <GroupSetForm course={course} />
    </GroupStoreProvider>
  );
}

function createTestStore(overrides: Partial<GroupStoreState>) {
  return create<GroupStore>(() => ({
    groups: [],
    groupSets: [],
    ...overrides,
    async assignGroups(course, groupSize) {

    },
    async recordGroups(course, name, groups) {
      window.calledRecordGroups++
      return new Promise<void>(resolve => {
        window.resolveRecordGroups = resolve as () => {}
      })
    },
  }))
}