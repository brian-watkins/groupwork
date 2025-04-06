import GroupList from "@/app/courses/[courseId]/groups/components/GroupList";
import { Group } from "@/domain/group";
import { createRoot } from 'react-dom/client';
import "@/app/globals.css"
import { GroupStoreProvider } from "@/app/contexts/GroupStoreContext";
import { createTestStore } from "./testStore";
import { DisplayableGroupSet } from "@/app/courses/[courseId]/groups/components/DisplayableGroupSet";
import { GroupSetId } from "@/domain/groupSet";

export function render(groupSetId: GroupSetId | undefined, newGroups: Array<Group>, groupSets: DisplayableGroupSet[] = []) {
  const elementRoot = document.createElement("div")
  document.body.appendChild(elementRoot)
  const root = createRoot(elementRoot)
  
  root.render(
    <GroupStoreProvider store={createTestStore({ newGroups, groupSets })}>
      <GroupList groupSetId={groupSetId}></GroupList>
    </GroupStoreProvider>
  )
}