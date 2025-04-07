import { courseReader } from '@/app/app-config';
import { EditCourseClient } from './EditCourseClient';
import { currentUser } from '@clerk/nextjs/server';
import { unauthorized } from 'next/navigation';
import { toTeacher } from '@/lib/domainHelpers';

export default async function EditCoursePage({
  params
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  const user = await currentUser();

  if (!user) {
    return unauthorized()
  }

  const course = await courseReader.get(toTeacher(user), courseId);

  return (
    <EditCourseClient course={course} />
  );
}
