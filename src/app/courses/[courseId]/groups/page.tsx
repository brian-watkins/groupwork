import { courseReader, groupSetReader } from "@/app/app-config";
import { CourseId } from "@/domain/course";
import { notFound, unauthorized } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { toDisplayableGroupSets } from "./components/DisplayableGroupSet";
import GroupsContent from "./components/GroupsContent";
import { toTeacher } from "@/lib/domainHelpers";
import { ResultType } from "@/domain/result";

export default async function CourseStudentsPage({
  params
}: {
  params: Promise<{ courseId: CourseId }>
}) {
  const { courseId } = await params;

  const user = await currentUser();

  if (!user) {
    return unauthorized()
  }

  const courseResult = await courseReader.get(toTeacher(user), courseId);

  if (courseResult.type === ResultType.ERROR) {
    return notFound()
  }

  const course = courseResult.value

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
