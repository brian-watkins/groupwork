"use server"

import { Course } from "@/domain/course"
import { courseWriter } from "@/app/app-config"
import { currentUser } from "@clerk/nextjs/server"
import { unauthorized } from "next/navigation"
import { toTeacher } from "@/lib/domainHelpers"

export async function deleteCourse(course: Course): Promise<void> {
  const user = await currentUser()

  if (!user) {
    unauthorized()
  }

  try {
    await courseWriter.delete(toTeacher(user), course)
  } catch (error) {
    console.error("Error deleting course:", error)
    throw error
  }
}
