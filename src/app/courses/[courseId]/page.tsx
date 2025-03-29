import { CourseId } from "@/domain/course";
import { notFound } from "next/navigation";
import { courseReader } from "../../app-config";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{course.name}</h1>
      
      <div data-testid="student-list">
        <h2 className="text-xl font-semibold mb-4">Students</h2>
        
        {course.students.length === 0 ? (
          <p className="text-gray-500">No students enrolled in this course yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {course.students.map(student => (
              <li 
                key={student.id} 
                className="py-4"
                data-testid={`student-${student.id}`}
              >
                <div data-student-name className="font-medium">{student.name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
