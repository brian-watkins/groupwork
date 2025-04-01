import { DateTime } from "luxon";
import { Course } from "./course";
import { Group } from "./group";

export interface GroupSetDetails {
  course: Course
  name: string
  createdAt?: DateTime
  groups: Array<Group>
}

export interface GroupSetWriter {
  create(details: GroupSetDetails): Promise<void>
}