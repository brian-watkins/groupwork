"use client"

import { Button } from "react-aria-components"
import { useRouter } from "next/navigation"

export function CreateCourseButton() {
  const router = useRouter()

  const handleCreateCourse = () => {
    router.push("/courses/create")
  }

  return (
    <Button
      data-create-course-button
      onPress={handleCreateCourse}
      className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
    >
      Create Course
    </Button>
  )
}
