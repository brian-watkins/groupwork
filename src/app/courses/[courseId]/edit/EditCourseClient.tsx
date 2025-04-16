"use client"

import { useRouter } from "next/navigation"
import { CourseForm } from "../../components/CourseForm"
import { CourseActionsProvider } from "../../../contexts/CourseActionsContext"
import { updateCourse } from "../../../actions/updateCourse"
import { createCourse } from "../../../actions/createCourse"
import { Course } from "@/domain/course"

interface EditCourseClientProps {
  course: Course
}

export function EditCourseClient({ course }: EditCourseClientProps) {
  const router = useRouter()

  function returnToMain() {
    router.push("/courses")
  }

  return (
    <CourseActionsProvider actions={{ createCourse, updateCourse }}>
      <CourseForm shouldReturnToMain={returnToMain} courseToEdit={course} />
    </CourseActionsProvider>
  )
}
