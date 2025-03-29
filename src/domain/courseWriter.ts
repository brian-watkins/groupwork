import { Course } from "./course";

export interface CourseWriter {
  write(course: Course): Promise<void>
}