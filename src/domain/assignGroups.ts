import {
  RandomGenerator,
  unsafeUniformIntDistribution,
  xoroshiro128plus,
} from "pure-rand"
import { CourseId } from "./course"
import { Group, isValidGroupSize } from "./group"
import { Student } from "./student"
import { CourseReader } from "./courseReader"
import { GroupsReader } from "./groupReader"
import { Teacher } from "./teacher"
import { errorResult, okResult, Result, ResultType } from "./result"

export interface AssignGroupsCommand {
  courseId: CourseId
  size: number
}

interface StudentHistory {
  student: Student
  history: Array<Student>
}

export enum AssignGroupsError {
  Unauthorized,
}

export async function assignGroups(
  teacher: Teacher,
  courseReader: CourseReader,
  groupsReader: GroupsReader,
  command: AssignGroupsCommand,
): Promise<Result<Group[], AssignGroupsError>> {
  const courseResult = await courseReader.get(teacher, command.courseId)

  if (courseResult.type === ResultType.ERROR) {
    return errorResult(AssignGroupsError.Unauthorized)
  }

  const course = courseResult.value

  const history = await groupsReader.get(command.courseId)

  if (!isValidGroupSize(command.size, course.students.length)) {
    throw new Error(
      `Invalid group size: ${command.size}. Must be between 2 and ${Math.floor(course.students.length / 2)}`,
    )
  }

  const studentHistories = course.students
    .map((student) => makeStudentHistory(history, student))
    .sort(byNumberWorkedWithAlready)

  return okResult(findGroups(studentHistories, command.size))
}

function makeStudentHistory(
  groups: Array<Group>,
  student: Student,
): StudentHistory {
  return {
    student,
    history: workedWith(groups, student),
  }
}

function findGroups(
  histories: Array<StudentHistory>,
  size: number,
): Array<Group> {
  const numberGroups = numberOfGroups(histories, size)

  const picker = new IndexPicker()

  const groups: Array<Group> = new Array(numberGroups)
    .fill(undefined)
    .map(() => ({ members: new Set() }))

  for (const record of histories) {
    let availableGroups: Array<Group> = []
    for (const group of groups) {
      if (
        group.members.size < size &&
        !containsAnyOverlappingStudents(
          Array.from(group.members),
          record.history,
        )
      ) {
        availableGroups.push(group)
      }
    }
    if (availableGroups.length === 0) {
      availableGroups = groups.filter((group) => group.members.size < size)
    }
    if (availableGroups.length === 0) {
      availableGroups = groups
    }
    const groupNumber = picker.getIndex(availableGroups)
    availableGroups[groupNumber].members.add(record.student)
  }

  return groups
}

function numberOfGroups(
  histories: Array<StudentHistory>,
  size: number,
): number {
  const remainder = histories.length % size
  const baseGroups = Math.floor(histories.length / size)
  return remainder <= 1 ? baseGroups : baseGroups + 1
}

function byNumberWorkedWithAlready(
  a: StudentHistory,
  b: StudentHistory,
): number {
  if (a.history.length < b.history.length) {
    return -1
  } else if (a.history.length > b.history.length) {
    return 1
  }
  return 0
}

function containsAnyOverlappingStudents(
  group: Array<Student>,
  history: Array<Student>,
): boolean {
  const ids = group.map((s) => s.id)
  for (const historyItem of history) {
    if (ids.includes(historyItem.id)) {
      return true
    }
  }
  return false
}

function workedWith(history: Array<Group>, student: Student): Array<Student> {
  const partners = history.reduce((acc, cur) => {
    const members = Array.from(cur.members)
    if (members.map((m) => m.id).includes(student.id)) {
      return acc.union(cur.members)
    } else {
      return acc
    }
  }, new Set<Student>())

  return Array.from(partners).filter((s) => s.id !== student.id)
}

class IndexPicker {
  private generator: RandomGenerator

  constructor() {
    const seed = Date.now() ^ (Math.random() * 0x100000000)
    this.generator = xoroshiro128plus(seed)
  }

  getIndex<T>(items: Array<T>) {
    return unsafeUniformIntDistribution(0, items.length - 1, this.generator)
  }
}
