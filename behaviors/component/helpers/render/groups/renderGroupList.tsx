import GroupList from "@/app/courses/[courseId]/groups/components/GroupList";
import { Group } from "@/domain/group";
import { createRoot } from 'react-dom/client';
import "@/app/globals.css"
import { GroupStoreProvider } from "@/app/contexts/GroupStoreContext";
import { createTestStore } from "./testStore";
import { DisplayableGroupSet } from "@/app/courses/[courseId]/groups/components/DisplayableGroupSet";
import { GroupSetId } from "@/domain/groupSet";
import { testCourse } from "../../../../domain/helpers/testCourse";

export function render(groupSetId: GroupSetId | undefined, newGroups: Array<Group>, groupSets: DisplayableGroupSet[] = [], editable: boolean) {
  const elementRoot = document.createElement("div")
  document.body.appendChild(elementRoot)
  const root = createRoot(elementRoot)
  
  const course = testCourse(1)
    .withStudents(newGroups.flatMap(group => Array.from(group.members)))

  root.render(
    <GroupStoreProvider store={createTestStore({ course, newGroups, groupSets })}>
      <GroupList groupSetId={groupSetId} editable={editable}></GroupList>
    </GroupStoreProvider>
  )
}