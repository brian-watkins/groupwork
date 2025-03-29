import { RandomGenerator, unsafeUniformIntDistribution, xoroshiro128plus } from "pure-rand"
import { Course, CourseId } from "./course";
import { Group } from "./group";
import { Student } from "./student";

export interface ChooseGroupsCommand {
  courseId: CourseId,
  size: number
}

export interface CourseReader {
  get(courseId: CourseId): Promise<Course>
}

export interface GroupsReader {
  get(courseId: CourseId): Promise<Array<Group>>
}

export async function chooseGroups(courseReader: CourseReader, groupsReader: GroupsReader, command: ChooseGroupsCommand): Promise<Group[]> {
  const course = await courseReader.get(command.courseId)
  const history = await groupsReader.get(command.courseId)
  
  return findGroupsOfSize(history, course.students, command.size)
}

function findGroupsOfSize(history: Array<Group>, students: Array<Student>, size: number) {
  const groups: Array<Group> = []
  let availableStudents = Array.from(students)

  const picker = new IndexPicker()

  while (availableStudents.length >= size) {
    let members = new Set<Student>()
    let availableForGroup = Array.from(availableStudents)
    for (let i = 0; i < size; i++) {
      const index = picker.getIndex(availableForGroup)
      const student = availableForGroup[index]
      members.add(student)
      availableForGroup.splice(index, 1)
      const workedWithStudent = workedWith(history, student)
      for (const worked of workedWithStudent) {
        const index = availableForGroup.findIndex(s => s.id === worked.id)
        if (index >= 0) {
          availableForGroup.splice(index, 1)
        }
      }
      availableStudents = availableStudents.filter(s => s.id !== student.id)
    }
    if (availableStudents.length < size) {
      if (availableStudents.length > 1) {
        groups.push({ members })
        members = new Set()
      }
      availableStudents.forEach(student => members.add(student))
    }
    groups.push({ members })
  }

  return groups
}

function workedWith(history: Array<Group>, student: Student): Set<Student> {
  return history.reduce((acc, cur) => {
    const members = Array.from(cur.members)
    if (members.map(m => m.id).includes(student.id)) {
      return acc.union(cur.members)
    } else {
      return acc
    }
  }, new Set<Student>())
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