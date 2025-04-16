import { courseReader } from "@/app/app-config"
import { EditCourseClient } from "./EditCourseClient"
import { currentUser } from "@clerk/nextjs/server"
import { notFound, unauthorized } from "next/navigation"
import { toTeacher } from "@/lib/domainHelpers"
import { ResultType } from "@/domain/result"

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  const user = await currentUser()

  if (!user) {
    unauthorized()
  }

  const courseResult = await courseReader.get(toTeacher(user), courseId)

  if (courseResult.type === ResultType.ERROR) {
    notFound()
  }

  return <EditCourseClient course={courseResult.value} />
}
