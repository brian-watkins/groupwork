import { Student, StudentId } from "./student"

export interface Group {
  readonly members: Set<Student>
}

export function isValidGroupSize(size: number, studentCount: number): boolean {
  return size >= 2 && size <= Math.floor(studentCount / 2)
}

export function workedTogetherAlready(
  history: Array<Group>,
  group: Group,
): Map<StudentId, Student[]> {
  const collaborationMap = new Map<StudentId, Student[]>()

  for (const student of group.members) {
    const pastGroupsWithStudent = history.filter((pastGroup) =>
      Array.from(pastGroup.members).some((member) => member.id === student.id),
    )

    const studentsWorkedWith: Set<Student> = pastGroupsWithStudent.reduce(
      (acc, cur) => {
        Array.from(cur.members)
          .filter((s) => s.id !== student.id)
          .filter((s) => Array.from(group.members).some((m) => m.id === s.id))
          .forEach((s) => acc.add(s))
        return acc
      },
      new Set<Student>(),
    )

    collaborationMap.set(student.id, Array.from(studentsWorkedWith))
  }

  return collaborationMap
}
