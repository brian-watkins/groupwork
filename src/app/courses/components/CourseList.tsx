"use client"

import { Course } from "@/domain/course"
import Link from "next/link"
import { Heading, Button, DialogTrigger } from "react-aria-components"
import { useRouter } from "next/navigation"
import { deleteCourse } from "../../actions/deleteCourse"
import {
  ConfirmationDialog,
  ConfirmationDialogAction,
  ConfirmationDialogHeader,
  ConfirmationDialogMessage,
} from "@/app/components/ConfirmationDialog"

interface CourseListProps {
  courses: Course[]
}

export function CourseList({ courses }: CourseListProps) {
  const router = useRouter()

  const handleConfirmDelete = async (course: Course) => {
    await deleteCourse(course)
    router.refresh()
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
                <DialogTrigger>
                  <Button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    data-delete-course-button
                  >
                    Delete
                  </Button>
                  <ConfirmationDialog data-delete-course-confirmation>
                    <ConfirmationDialogHeader>
                      Delete Course
                    </ConfirmationDialogHeader>
                    <ConfirmationDialogMessage>
                      Are you sure you want to delete&nbsp;
                      <strong>{course.name}</strong>? This action cannot be
                      undone.
                    </ConfirmationDialogMessage>
                    <ConfirmationDialogAction
                      onConfirm={() => handleConfirmDelete(course)}
                    >
                      Delete course
                    </ConfirmationDialogAction>
                  </ConfirmationDialog>
                </DialogTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
