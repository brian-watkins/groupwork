import { Course, CourseId } from "./course";
import { Result } from "./result";
import { Teacher } from "./teacher";

export enum CourseReaderError {
  NotFound
}

export interface CourseReader {
  getAll(teacher: Teacher): Promise<Array<Course>> 
  get(teacher: Teacher, courseId: CourseId): Promise<Result<Course, CourseReaderError>>
}
