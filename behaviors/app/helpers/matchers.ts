import { Student } from "@/domain/student"
import { equalTo, Matcher } from "great-expectations"

export function studentName(student: Student): Matcher<string> {
  return equalTo(student.name)
}
