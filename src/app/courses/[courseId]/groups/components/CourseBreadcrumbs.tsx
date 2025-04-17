"use client"

import { Course } from "@/domain/course"
import { Breadcrumbs, Link, Breadcrumb } from "react-aria-components"
import { ChevronRight } from "lucide-react"

interface CourseBreadcrumbsProps {
  course: Course
}

export default function CourseBreadcrumbs({ course }: CourseBreadcrumbsProps) {
  return (
    <Breadcrumbs className="flex items-center gap-2 text-2xl font-bold">
      <Breadcrumb id="courses" className="flex items-center gap-2">
        <Link href="/courses" className="hover:underline">
          Courses
        </Link>
        <ChevronRight className="text-gray-800" />
      </Breadcrumb>
      <Breadcrumb id="course" className="flex items-center gap-2">
        <span>{course.name}</span>
        <ChevronRight className="text-gray-800" />
      </Breadcrumb>
      <Breadcrumb id="groups" className="text-gray-800">
        Groups
      </Breadcrumb>
    </Breadcrumbs>
  )
}
