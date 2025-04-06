'use server';

import { Course } from '@/domain/course';
import { courseWriter } from '@/app/app-config';

export async function updateCourse(course: Course): Promise<void> {
  try {
    await courseWriter.save(course);
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
}
