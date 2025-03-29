"use client";

import { Course } from "@/domain/course";
import { Heading } from "react-aria-components";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <Heading level={3} className="text-xl font-medium text-gray-900" data-course-name>
          {course.name}
        </Heading>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {course.students.length} students
          </p>
          <Link 
            href={`/courses/${course.id}`} 
            className="text-sky-600 hover:text-sky-800 text-sm font-medium"
            data-course-details
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
}