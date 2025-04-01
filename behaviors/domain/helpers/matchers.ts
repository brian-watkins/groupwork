import { arrayContaining, equalTo, Matcher, objectWithProperty, satisfying, setContaining, valueWhere } from "great-expectations"
import { Student } from "../../../src/domain/student"
import { testStudent } from "./testStudent"
import { Group } from "@/domain/group"

export function groupSetWithStudents(studentMatchers: Array<Matcher<Student>>): Matcher<Array<Group>> {
  return satisfying(
    studentMatchers.map(student => arrayContaining(objectWithProperty("members", setContaining(student))))
  )
}

export function groupSetWithGroupSatisfying(members: Array<Matcher<Set<Student>>>): Matcher<Array<Group>> {
  return arrayContaining(objectWithProperty("members", satisfying(members)))
}

export function student(testId: number): Matcher<Student> {
  return objectWithProperty("id", equalTo(testStudent(testId).id))
}

export function students(size: number): Array<Matcher<Student>> {
  let matchers: Array<Matcher<Student>> = []
  for (let i = 1; i <= size; i++) {
    matchers.push(student(i))
  }
  return matchers
}

export function setWithSize<T>(expectedSize: number): Matcher<Set<T>> {
  return valueWhere((set) => set.size === expectedSize, `a set that has size ${expectedSize}`)
}