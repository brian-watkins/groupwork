import GroupSetForm from "@/app/courses/[courseId]/groups/components/GroupSetForm";
import { Group } from "@/domain/group";
import { createRoot } from 'react-dom/client';
import "@/app/globals.css";
import { GroupStoreProvider } from "@/app/contexts/GroupStoreContext";
import { Course } from "@/domain/course";
import { createTestStore } from "./testStore";

export function render(
  course: Course,
  groups: Array<Group>,
) {
  const elementRoot = document.createElement("div");
  document.body.appendChild(elementRoot);
  const root = createRoot(elementRoot);

  root.render(
    <GroupStoreProvider store={createTestStore({ course, newGroups: groups })}>
      <GroupSetForm onClose={() => { }} />
    </GroupStoreProvider>
  );
}
