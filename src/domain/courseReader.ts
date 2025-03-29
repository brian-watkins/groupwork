import { Course, CourseId } from "./course";

export interface CourseReader {
  get(courseId: CourseId): Promise<Course>
}
