import { equalTo, Matcher, objectWithProperty, valueWhere } from "great-expectations"
import { Student } from "../../../src/domain/student"
import { testStudent } from "./testStudent"
import { Group } from "../../../src/domain/group"

export function allStudentsIn(groups: Array<Group>): Array<Student> {
  return groups
    .reduce((acc, cur) => {
      return acc.concat(Array.from(cur.members))
    }, [] as Array<Student>)
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