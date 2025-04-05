export interface StudentDetails {
  name: string
}

export interface CourseDetails {
  name: string
  students: Array<StudentDetails>
}

export interface CourseWriter {
  write(course: CourseDetails): Promise<void>
}