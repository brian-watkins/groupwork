import { Student } from "./student";

export interface Group {
  readonly members: Set<Student>
}

export function isValidGroupSize(size: number, studentCount: number): boolean {
  return size >= 2 && size <= Math.floor(studentCount / 2);
}

export function workedTogetherAlready(history: Array<Group>, group: Group): Array<Array<Student>> {
  const collaborators: Array<Array<Student>> = []
  const groupIds = Array.from(group.members).map(g => g.id)
  for (const student of group.members) {
    const groupIdsWithoutStudent = groupIds.filter(i => i !== student.id)
    const studentsWhoHaveBeenInAGroupWithThisStudent = history
      .filter(g => Array.from(g.members).map(m => m.id).includes(student.id))
      .filter(g => Array.from(g.members).some(s => groupIdsWithoutStudent.includes(s.id)))
      .map(g => Array.from(g.members).filter(m => groupIds.includes(m.id)))

    for (const studentSet of studentsWhoHaveBeenInAGroupWithThisStudent) {
      const studentSetIdSet = new Set(studentSet.map(s => s.id))
      const hasCollab = collaborators
        .some(collab => (new Set(collab.map(c => c.id))).intersection(studentSetIdSet).size === studentSetIdSet.size)
      if (!hasCollab) {
        collaborators.push(studentSet)
      }
    }
  }

  return collaborators
}