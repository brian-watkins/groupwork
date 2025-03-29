import { Student } from "./student";

export interface Group {
  readonly members: Set<Student>
}