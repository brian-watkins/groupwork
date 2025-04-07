import { unauthorized } from "next/navigation";
import { courseReader } from "../app-config";
import { CourseList } from "../components/CourseList";
import { CourseHeading } from "../components/client/CourseHeading";
import { CreateCourseButton } from "../components/client/CreateCourseButton";
import { currentUser } from "@clerk/nextjs/server";
import { toTeacher } from "@/lib/domainHelpers";

export default async function Page() {
  const user = await currentUser()

  if (!user) {
    return unauthorized()
  }

  const courses = await courseReader.getAll(toTeacher(user));

  return (
    <main className="container mx-auto px-4 py-8">
      <CourseHeading level={1} className="text-3xl font-bold text-sky-600 mb-4">
        Welcome to GroupWork!
      </CourseHeading>

      <p className="text-gray-600 mb-8">
        A platform for managing courses and student groups.
      </p>

      <div className="flex justify-between items-center mb-6">
        <CourseHeading level={2} className="text-2xl font-bold text-sky-600">
          Courses
        </CourseHeading>
        <CreateCourseButton />
      </div>

      <CourseList courses={courses} />
    </main>
  );
}