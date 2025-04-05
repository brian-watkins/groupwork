'use server';

import { courseWriter } from '@/app/app-config';
import { StudentDetails } from '@/domain/courseWriter';
import { Student } from '@/domain/student';

interface CreateCourseParams {
  name: string;
  students: StudentDetails[];
}

export async function createCourse(params: CreateCourseParams): Promise<void> {
  const { name, students } = params;
  
  try {
    await courseWriter.write({
      name,
      students
    })
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
}
