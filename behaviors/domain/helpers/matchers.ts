import {
  arrayContaining,
  equalTo,
  Invalid,
  Matcher,
  message,
  objectWithProperty,
  problem,
  satisfying,
  setContaining,
  setWith,
  valueWhere,
} from "great-expectations"
import { Student } from "../../../src/domain/student"
import { testStudent } from "./testStudent"
import { Group } from "@/domain/group"
import { Result, ResultType } from "@/domain/result"

export function groupSetWithStudents(
  studentMatchers: Array<Matcher<Student>>,
): Matcher<Array<Group>> {
  return satisfying(
    studentMatchers.map((student) =>
      arrayContaining(objectWithProperty("members", setContaining(student))),
    ),
  )
}

export function groupSetWithGroupSatisfying(
  members: Array<Matcher<Set<Student>>>,
): Matcher<Array<Group>> {
  return arrayContaining(objectWithProperty("members", satisfying(members)))
}

export function groupWithMembers(
  members: Array<Matcher<Student>>,
): Matcher<Group> {
  return objectWithProperty("members", setWith(members))
}

export function student(testId: number): Matcher<Student> {
  return objectWithProperty("id", equalTo(testStudent(testId).id))
}

export function studentName(testId: number): Matcher<Student> {
  return objectWithProperty("name", equalTo(testStudent(testId).name))
}

export function students(size: number): Array<Matcher<Student>> {
  let matchers: Array<Matcher<Student>> = []
  for (let i = 1; i <= size; i++) {
    matchers.push(student(i))
  }
  return matchers
}

export function setWithSize<T>(expectedSize: number): Matcher<Set<T>> {
  return valueWhere(
    (set) => set.size === expectedSize,
    `a set that has size ${expectedSize}`,
  )
}

export function okResultWith<T, E>(matcher: Matcher<T>): Matcher<Result<T, E>> {
  return (actual) => {
    if (actual.type === ResultType.OK) {
      return objectWithProperty("value", matcher)(actual)
    } else {
      return new Invalid("The result was not ok.", {
        actual: problem(actual),
        expected: message`An ok result`,
      })
    }
  }
}

export function errorResultWith<T, E>(
  matcher: Matcher<E>,
): Matcher<Result<T, E>> {
  return (actual) => {
    if (actual.type === ResultType.ERROR) {
      return objectWithProperty("error", matcher)(actual)
    } else {
      return new Invalid("The result was not an error.", {
        actual: problem(actual),
        expected: message`An error result`,
      })
    }
  }
}
