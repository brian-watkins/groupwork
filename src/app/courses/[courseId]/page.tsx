import { CourseId } from "@/domain/course";
import { notFound } from "next/navigation";
import { courseReader } from "../../app-config";
import CourseContent from "./components/CourseContent";

export default async function CourseStudentsPage({
  params
}: {
  params: { courseId: CourseId }
}) {
  const { courseId } = await params;

  let course;
  try {
    course = await courseReader.get(courseId);
  } catch (error) {
    notFound();
  }

  if (course.students.length == 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{course.name}</h1>
        <div data-no-students>There are no students in the course!</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{course.name}</h1>

      <CourseContent
        courseId={courseId}
        students={course.students}
      />
    </div>
  );
}
