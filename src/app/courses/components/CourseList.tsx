"use client"

import { Course } from "@/domain/course"
import Link from "next/link"
import { Heading, Button } from "react-aria-components"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ConfirmationModal } from "@/app/components/ConfirmationModal"
import { deleteCourse } from "../../actions/deleteCourse"

interface CourseListProps {
  courses: Course[]
}

export function CourseList({ courses }: CourseListProps) {
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const router = useRouter()

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course)
  }

  const handleCloseModal = () => {
    setCourseToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      await deleteCourse(courseToDelete)
      router.refresh()
    }
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No courses available.</p>
      </div>
    )
  }

  return (
    <div data-testid="course-list" className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course Name
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Students
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map((course) => (
            <tr data-course key={course.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/courses/${course.id}/groups`}>
                  <Heading
                    level={3}
                    className="text-lg font-medium text-gray-900 hover:text-sky-600"
                    data-course-name
                  >
                    {course.name}
                  </Heading>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {course.students.length} students
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 justify-end">
                <Link
                  href={`/courses/${course.id}/edit`}
                  className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                  data-edit-course-button
                >
                  Edit Course
                </Link>
                <Link
                  href={`/courses/${course.id}/groups`}
                  className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                  data-course-details
                >
                  View Groups
                </Link>
                <Button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  onPress={() => handleDeleteClick(course)}
                  data-delete-course-button
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {courseToDelete && (
        <ConfirmationModal
          testId="delete-course-confirmation"
          title="Delete Course"
          message={
            <>
              Are you sure you want to delete{" "}
              <strong>{courseToDelete.name}</strong>? This action cannot be
              undone.
            </>
          }
          confirmButtonText="Delete Course"
          isOpen={true}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
