import { createRoot } from 'react-dom/client';
import "@/app/globals.css";
import { CourseActions, CourseActionsProvider } from "@/app/contexts/CourseActionsContext";
import { CourseForm } from "@/app/courses/components/CourseForm";

window.shouldReturnToMainCalls = 0

export function render() {
  const elementRoot = document.createElement("div");
  document.body.appendChild(elementRoot);
  const root = createRoot(elementRoot);

  const testActions: CourseActions = {
    createCourse: async (name, students) => {
      window.createCourseDetails = { name, students }
    },
    updateCourse: async (course) => { }
  }

  function testReturnToMain() {
    window.shouldReturnToMainCalls++
  }

  root.render(
    <CourseActionsProvider actions={testActions}>
      <CourseForm shouldReturnToMain={testReturnToMain}></CourseForm>
    </CourseActionsProvider>
  );
}