'use server';

import { Course } from '@/domain/course';
import { courseWriter } from '@/app/app-config';

export async function deleteCourse(course: Course): Promise<void> {
  try {
    await courseWriter.delete(course);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
}
