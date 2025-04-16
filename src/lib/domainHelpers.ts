import { Teacher } from "@/domain/teacher"
import { User } from "@clerk/nextjs/server"

export function toTeacher(user: User): Teacher {
  return {
    id: user.id,
  }
}
