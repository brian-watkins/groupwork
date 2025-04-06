'use server';

import { courseWriter } from '@/app/app-config';

export async function createCourse(name: string, students: Array<string>): Promise<void> {
  try {
    await courseWriter.write({
      name,
      students: students.map(name => ({ name }))
    })
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
}
