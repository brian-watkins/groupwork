import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.student.deleteMany();
  await prisma.course.deleteMany();
  
  // Create courses with students
  const introToProgramming = await prisma.course.create({
    data: {
      name: 'Introduction to Programming',
      students: {
        create: [
          { name: 'Alice Smith' },
          { name: 'Bob Johnson' },
          { name: 'Carol Davis' }
        ]
      }
    }
  });
  
  const dataStructures = await prisma.course.create({
    data: {
      name: 'Data Structures and Algorithms',
      students: {
        create: [
          { name: 'David Wilson' },
          { name: 'Eve Brown' },
          { name: 'Frank Miller' },
          { name: 'Grace Lee' }
        ]
      }
    }
  });
  
  const webDevelopment = await prisma.course.create({
    data: {
      name: 'Web Development',
      students: {
        create: [
          { name: 'Hannah Taylor' },
          { name: 'Ian Anderson' },
          { name: 'Julia Martinez' },
          { name: 'Kevin Thompson' },
          { name: 'Lily White' }
        ]
      }
    }
  });
 
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });