import { courseReader, groupSetReader } from "@/app/app-config";
import { CourseId } from "@/domain/course";
import { notFound } from "next/navigation";
import { toDisplayableGroupSets } from "./components/DisplayableGroupSet";
import GroupsContent from "./components/GroupsContent";

export default async function CourseStudentsPage({
  params
}: {
  params: Promise<{ courseId: CourseId }>
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

  const groupSets = await groupSetReader.getByCourse(courseId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{course.name}</h1>

      <GroupsContent
        course={course}
        groupSets={toDisplayableGroupSets(groupSets)}
      />
    </div>
  );
}
