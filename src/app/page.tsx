import { courseReader } from "./app-config";
import { CourseList } from "./components/CourseList";
import { CourseHeading } from "./components/client/CourseHeading";

export default async function Page() {
  const courses = await courseReader.getAll();

  return (
    <main className="container mx-auto px-4 py-8">
      <CourseHeading level={1} className="text-3xl font-bold text-sky-600 mb-4">
        Welcome to GroupWork!
      </CourseHeading>
      
      <p className="text-gray-600 mb-8">
        A platform for managing courses and student groups.
      </p>
      
      <CourseHeading level={2} className="text-2xl font-bold text-sky-600 mb-6">
        Courses
      </CourseHeading>
      
      <CourseList courses={courses} />
    </main>
  );
}