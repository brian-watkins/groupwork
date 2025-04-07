import { courseReader } from '@/app/app-config';
import { EditCourseClient } from './EditCourseClient';

export default async function EditCoursePage({
  params
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = await courseReader.get(courseId);

  return (
    <EditCourseClient course={course} />
  );
}
