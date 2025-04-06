import { CourseHeading } from "@/app/components/client/CourseHeading";
import { useCreateCourseAction, useUpdateCourseAction } from "@/app/contexts/CourseActionsContext";
import { Course } from "@/domain/course";
import { Student } from "@/domain/student";
import { useState, useEffect } from "react";
import { Button, Input, Label } from "react-aria-components";

export interface CourseFormProps {
  shouldReturnToMain: () => void;
  courseToEdit?: Course;
}

export function CourseForm({ shouldReturnToMain, courseToEdit }: CourseFormProps) {
  const [courseName, setCourseName] = useState(courseToEdit?.name ?? "")
  const [studentName, setStudentName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [students, setStudents] = useState<Array<Student>>(courseToEdit?.students ?? [])
  const [studentError, setStudentError] = useState<string | null>(null)
  const createCourse = useCreateCourseAction();
  const updateCourse = useUpdateCourseAction();

  useEffect(() => {
    if (studentError) {
      setStudentError(null)
    }
  }, [studentName])

  const handleSubmit = async () => {
    if (!courseName) return;

    setIsSubmitting(true);

    try {
      if (courseToEdit) {
        await updateCourse({
          ...courseToEdit,
          name: courseName,
          students: students
        });
      } else {
        await createCourse(
          courseName,
          students.map(student => student.name)
        );
      }
      shouldReturnToMain();
    } catch (error) {
      console.error(`Failed to save course:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddStudent = () => {
    if (!studentName.trim()) return;

    const trimmedName = studentName.trim();

    if (students.some(student => student.name === trimmedName)) {
      setStudentError("A student with this name already exists");
      return;
    }

    setStudents([{ id: "", name: trimmedName }, ...students]);
    setStudentName('');
  };

  const removeStudent = (index: number) => {
    const studentsList = [...students];
    studentsList.splice(index, 1);
    setStudents(studentsList);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddStudent();
    }
  };

  const handleCancel = () => {
    shouldReturnToMain()
  };

  const allowSubmit = (): boolean => {
    if (courseName.trim() === "") {
      return false;
    }
    if (students.length === 0) {
      return false;
    }
    if (isSubmitting) {
      return false;
    }
    return true;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CourseHeading level={1} className="text-2xl font-bold mb-6">
        {courseToEdit ? 'Edit Course' : 'Create Course'}
      </CourseHeading>

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name
          </Label>
          <Input
            data-course-name-input
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter course name"
          />
        </div>

        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Add Students
          </Label>
          <div className="flex flex-col">
            <div className="flex">
              <Input
                data-student-name-input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-invalid={studentError ? "true" : undefined}
                className={`w-full px-3 py-2 border rounded-md shadow-sm ${studentError ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter student name"
              />
              <Button
                data-add-student-button
                onPress={handleAddStudent}
                className="ml-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
              >
                Add
              </Button>
            </div>
            {studentError && (
              <div
                data-student-error-message
                className="text-red-500 text-sm mt-1"
              >
                {studentError}
              </div>
            )}
          </div>
        </div>

        {students.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Students</h3>
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
              {students.map((student, index) => (
                <li data-student key={student.name} className="px-4 py-3 flex justify-between items-center">
                  <span data-student-name>{student.name}</span>
                  <button
                    data-remove-student
                    onClick={() => removeStudent(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between space-x-4">
          <Button
            data-cancel-button
            onPress={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            data-save-course-button
            onPress={handleSubmit}
            isDisabled={!allowSubmit()}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-gray-400"
          >
            {courseToEdit ? 'Save Changes' : 'Create Course'}
          </Button>
        </div>
      </div>
    </div>
  )
}