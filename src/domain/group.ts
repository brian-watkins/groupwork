import { Student } from "./student";

export interface Group {
  readonly members: Set<Student>
}

export function isValidGroupSize(size: number, studentCount: number): boolean {
  return size >= 2 && size <= Math.floor(studentCount / 2);
}