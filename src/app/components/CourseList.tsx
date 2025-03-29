"use client";

import { Course } from "@/domain/course";
import { CourseCard } from "./CourseCard";

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No courses available.</p>
      </div>
    );
  }

  return (
    <div data-testid="course-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}