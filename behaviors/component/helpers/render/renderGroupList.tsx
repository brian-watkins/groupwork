import GroupList from "@/app/courses/[courseId]/groups/components/GroupList";
import { Group } from "@/domain/group";
import { createRoot } from 'react-dom/client';
import "@/app/globals.css"
import { GroupStoreProvider } from "@/app/contexts/GroupStoreContext";
import { createTestStore } from "./testStore";

export function render(groups: Array<Group>) {
  const elementRoot = document.createElement("div")
  document.body.appendChild(elementRoot)
  const root = createRoot(elementRoot)
  
  root.render(
    <GroupStoreProvider store={createTestStore({ newGroups: groups })}>
      <GroupList></GroupList>
    </GroupStoreProvider>
  )
}