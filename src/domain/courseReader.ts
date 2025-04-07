import { Course, CourseId } from "./course";
import { Teacher } from "./teacher";

export interface CourseReader {
  getAll(teacher: Teacher): Promise<Array<Course>> 
  get(teacher: Teacher, courseId: CourseId): Promise<Course>
}
