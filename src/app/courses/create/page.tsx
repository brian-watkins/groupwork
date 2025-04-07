'use client';

import { useRouter } from 'next/navigation';
import { updateCourse } from '@/app/actions/updateCourse';
import { createCourse } from '@/app/actions/createCourse';
import { CourseActionsProvider } from '@/app/contexts/CourseActionsContext';
import { CourseForm } from '../components/CourseForm';

export default function CreateCoursePage() {
  const router = useRouter();

  function returnToMain() {
    router.push("/courses")
  }

  return (
    <CourseActionsProvider actions={{ createCourse, updateCourse }}>
      <CourseForm shouldReturnToMain={returnToMain}></CourseForm>
    </CourseActionsProvider>
  )
}
