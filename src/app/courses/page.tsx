'use client';

import { useRouter } from 'next/navigation';
import { CourseForm } from './components/CourseForm';
import { CourseActionsProvider } from '../contexts/CourseActionsContext';
import { createCourse } from '../stores/actions/createCourse';

export default function CreateCoursePage() {
  const router = useRouter();

  function returnToMain() {
    router.push("/")
  }

  return (
    <CourseActionsProvider actions={{ createCourse }}>
      <CourseForm shouldReturnToMain={returnToMain}></CourseForm>
    </CourseActionsProvider>
  )
}
