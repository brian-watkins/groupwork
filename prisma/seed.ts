import { PrismaClient } from "../src/generated/prisma/client"
import { DateTime } from "luxon"

const prisma = new PrismaClient()

const local_user_id = "user_2vMpeLfUzMuxfEw0LOqaXFF2rRg"

async function main() {
  // Clean existing data
  await prisma.group.deleteMany()
  await prisma.groupSet.deleteMany()
  await prisma.student.deleteMany()
  await prisma.course.deleteMany()

  // Create courses with students
  const introToProgramming = await prisma.course.create({
    data: {
      name: "Introduction to Programming",
      teacherId: local_user_id,
      students: {
        create: [
          { name: "Alice Smith" },
          { name: "Bob Johnson" },
          { name: "Carol Davis" },
        ],
      },
    },
  })

  const dataStructures = await prisma.course.create({
    data: {
      name: "Data Structures and Algorithms",
      teacherId: local_user_id,
      students: {
        create: [
          { name: "David Wilson" },
          { name: "Eve Brown" },
          { name: "Frank Miller" },
          { name: "Grace Lee" },
        ],
      },
    },
  })

  const webDevelopment = await prisma.course.create({
    data: {
      name: "Web Development",
      teacherId: local_user_id,
      students: {
        create: [
          { name: "Hannah Taylor" },
          { name: "Ian Anderson" },
          { name: "Julia Martinez" },
          { name: "Kevin Thompson" },
          { name: "Lily White" },
          { name: "Audrey Jones" },
          { name: "Mary Watkins" },
          { name: "Philip Watkins" },
          { name: "Ernest Jones" },
        ],
      },
    },
  })

  // Get all students from Web Development course
  const webDevStudents = await prisma.student.findMany({
    where: { courseId: webDevelopment.id },
  })

  // Create Project Teams group set
  await prisma.groupSet.create({
    data: {
      name: "Project Teams",
      courseId: webDevelopment.id,
      createdAt: DateTime.now().minus({ days: 14 }).toJSDate(),
      groups: {
        create: [
          {
            students: {
              connect: [
                { id: webDevStudents[0].id }, // Hannah
                { id: webDevStudents[1].id }, // Ian
                { id: webDevStudents[2].id }, // Julia
              ],
            },
          },
          {
            students: {
              connect: [
                { id: webDevStudents[3].id }, // Kevin
                { id: webDevStudents[4].id }, // Lily
                { id: webDevStudents[5].id }, // Audrey
              ],
            },
          },
          {
            students: {
              connect: [
                { id: webDevStudents[6].id }, // Mary
                { id: webDevStudents[7].id }, // Philip
                { id: webDevStudents[8].id }, // Ernest
              ],
            },
          },
        ],
      },
    },
  })

  // Create Lab Partners group set
  await prisma.groupSet.create({
    data: {
      name: "Lab Partners",
      courseId: webDevelopment.id,
      createdAt: DateTime.now().minus({ days: 7 }).toJSDate(),
      groups: {
        create: [
          {
            students: {
              connect: [
                { id: webDevStudents[0].id }, // Hannah
                { id: webDevStudents[3].id }, // Kevin
              ],
            },
          },
          {
            students: {
              connect: [
                { id: webDevStudents[1].id }, // Ian
                { id: webDevStudents[4].id }, // Lily
              ],
            },
          },
          {
            students: {
              connect: [
                { id: webDevStudents[2].id }, // Julia
                { id: webDevStudents[5].id }, // Audrey
              ],
            },
          },
          {
            students: {
              connect: [
                { id: webDevStudents[6].id }, // Mary
                { id: webDevStudents[7].id }, // Philip
                { id: webDevStudents[8].id }, // Ernest (team of 3)
              ],
            },
          },
        ],
      },
    },
  })

  // Create Study Groups group set (with different grouping)
  await prisma.groupSet.create({
    data: {
      name: "Study Groups",
      courseId: webDevelopment.id,
      createdAt: DateTime.now().minus({ days: 2 }).toJSDate(),
      groups: {
        create: [
          {
            students: {
              connect: [
                { id: webDevStudents[0].id }, // Hannah
                { id: webDevStudents[4].id }, // Lily
                { id: webDevStudents[8].id }, // Ernest
              ],
            },
          },
          {
            students: {
              connect: [
                { id: webDevStudents[1].id }, // Ian
                { id: webDevStudents[5].id }, // Audrey
                { id: webDevStudents[6].id }, // Mary
              ],
            },
          },
          {
            students: {
              connect: [
                { id: webDevStudents[2].id }, // Julia
                { id: webDevStudents[3].id }, // Kevin
                { id: webDevStudents[7].id }, // Philip
              ],
            },
          },
        ],
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
