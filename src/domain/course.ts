import { Student } from "./student"

export type CourseId = string

export interface Course {
  id: CourseId
  name: string
  students: Array<Student>
}
