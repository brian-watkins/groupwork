import GroupList from "@/app/courses/[courseId]/components/GroupList";
import { Group } from "@/domain/group";
import { createRoot } from 'react-dom/client';
import "@/app/globals.css"

export function render(groups: Array<Group>) {
  const elementRoot = document.createElement("div")
  document.body.appendChild(elementRoot)
  const root = createRoot(elementRoot)
  root.render(<GroupList groups={groups}></GroupList>) 
}