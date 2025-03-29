import { behavior, example, effect } from "best-behavior";
import { expect, is, equalTo, stringContaining, arrayWithLength } from "great-expectations";
import { PrismaCourseReader } from "../../src/domain/infrastructure/prismaCourseReader";
import { PrismaClient } from "@prisma/client";

interface Context {
  prisma: PrismaClient;
  courseId: string;
  courseReader: PrismaCourseReader;
}

// Context to set up and tear down the database for each test
const prismaCourseReaderContext = {
  init: async (): Promise<Context> => {
    // Create a new Prisma client for testing
    const prisma = new PrismaClient();
    
    // Create a test course
    const course = await prisma.course.create({
      data: {
        name: "Introduction to Programming",
        students: {
          create: [
            { name: "Alice Smith" },
            { name: "Bob Johnson" }
          ]
        }
      }
    });
    
    return {
      prisma,
      courseId: course.id,
      courseReader: new PrismaCourseReader(prisma)
    };
  },
  
  teardown: async (context: Context) => {
    // Clean up the database after test
    await context.prisma.student.deleteMany();
    await context.prisma.course.deleteMany();
    await context.prisma.$disconnect();
  }
};

export default behavior("PrismaCourseReader", [
  example(prismaCourseReaderContext)
    .description("reads a course with its students")
    .script({
      observe: [
        effect("it gets the course with the correct ID", async (context) => {
          const course = await context.courseReader.get(context.courseId);
          
          expect(course.id, is(equalTo(context.courseId)));
          expect(course.name, is(stringContaining("Introduction to Programming")));
          expect(course.students, is(arrayWithLength(2)));
        })
      ]
    }),
    
  example(prismaCourseReaderContext)
    .description("reads all courses")
    .script({
      observe: [
        effect("it gets a list of all courses", async (context) => {
          const courses = await context.courseReader.getAll();
          
          expect(courses.length, is(equalTo(1)));
          expect(courses[0].id, is(equalTo(context.courseId)));
          expect(courses[0].name, is(stringContaining("Introduction to Programming")));
          expect(courses[0].students, is(arrayWithLength(2)));
        })
      ]
    })
]);