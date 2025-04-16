"use server"

import { courseWriter } from "@/app/app-config"
import { toTeacher } from "@/lib/domainHelpers"
import { currentUser } from "@clerk/nextjs/server"
import { unauthorized } from "next/navigation"

export async function createCourse(
  name: string,
  students: Array<string>,
): Promise<void> {
  const user = await currentUser()

  if (!user) {
    unauthorized()
  }

  try {
    await courseWriter.write(toTeacher(user), {
      name,
      students: students.map((name) => ({ name })),
    })
  } catch (error) {
    console.error("Error creating course:", error)
    throw error
  }
}
