import GroupSetForm from "@/app/courses/[courseId]/components/GroupSetForm";
import { Group } from "@/domain/group";
import { createRoot } from 'react-dom/client';
import "@/app/globals.css";

export function render(
  groups: Array<Group>, 
  onRecordGroups: (name: string) => void = () => {}, 
  isRecording: boolean = false
) {
  const elementRoot = document.createElement("div");
  document.body.appendChild(elementRoot);
  const root = createRoot(elementRoot);
  
  root.render(
    <GroupSetForm 
      groups={groups} 
      onRecordGroups={onRecordGroups}
      isRecording={isRecording}
    />
  );
}