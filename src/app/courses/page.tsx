import { unauthorized } from "next/navigation"
import { CourseHeading } from "./components/client/CourseHeading"
import { CreateCourseButton } from "./components/client/CreateCourseButton"
import { currentUser } from "@clerk/nextjs/server"
import { toTeacher } from "@/lib/domainHelpers"
import { Suspense } from "react"
import { courseReader } from "../app-config"
import { Teacher } from "@/domain/teacher"
import { CourseList } from "./components/CourseList"

function CourseListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4 w-full"></div>
      <div className="h-10 bg-gray-200 rounded mb-4 w-full"></div>
      <div className="h-10 bg-gray-200 rounded mb-4 w-full"></div>
    </div>
  )
}

export default async function Page() {
  const user = await currentUser()

  if (!user) {
    unauthorized()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <CourseHeading level={1} className="text-3xl font-bold text-sky-600 mb-4">
        Welcome to GroupWork!
      </CourseHeading>

      <p className="text-gray-600 mb-8">
        A platform for managing courses and student groups.
      </p>

      <div className="flex justify-between items-center mb-6">
        <CourseHeading level={2} className="text-2xl font-bold text-sky-600">
          Courses
        </CourseHeading>
        <CreateCourseButton />
      </div>

      <Suspense fallback={<CourseListSkeleton />}>
        <CourseListContent teacher={toTeacher(user)} />
      </Suspense>
    </main>
  )
}

async function CourseListContent({ teacher }: { teacher: Teacher }) {
  const courses = await courseReader.getAll(teacher)
  return <CourseList courses={courses} />
}
