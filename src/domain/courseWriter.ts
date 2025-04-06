import { Course } from "./course"

export interface StudentDetails {
  name: string
}

export interface CourseDetails {
  name: string
  students: Array<StudentDetails>
}

export interface CourseWriter {
  write(course: CourseDetails): Promise<void>
  save(course: Course): Promise<void>
  delete(course: Course): Promise<void>
}