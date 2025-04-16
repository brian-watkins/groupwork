import { Course } from "./course"
import { Teacher } from "./teacher"

export interface StudentDetails {
  name: string
}

export interface CourseDetails {
  name: string
  students: Array<StudentDetails>
}

export interface CourseWriter {
  write(teacher: Teacher, course: CourseDetails): Promise<void>
  save(teacher: Teacher, course: Course): Promise<void>
  delete(teacher: Teacher, course: Course): Promise<void>
}
