'use client';

import { CourseHeading } from '@/app/components/client/CourseHeading';
import { useCourseStore } from '@/app/stores/courseStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input, Label } from 'react-aria-components';

export default function CreateCoursePage() {
  const router = useRouter();
  const { name, students, setName, addStudent, removeStudent, createCourse, reset } = useCourseStore();
  const [studentName, setStudentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name) return;
    
    setIsSubmitting(true);
    
    try {
      await createCourse();
      router.push('/');
    } catch (error) {
      console.error('Failed to create course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddStudent = () => {
    if (!studentName.trim()) return;
    
    addStudent(studentName.trim());
    setStudentName('');
  };
  
  const handleCancel = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CourseHeading level={1} className="text-2xl font-bold mb-6">
        Create Course
      </CourseHeading>
      
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name
          </Label>
          <Input 
            data-course-name-input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter course name" 
          />
        </div>
        
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Add Students
          </Label>
          <div className="flex">
            <Input 
              data-student-name-input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Enter student name" 
            />
            <Button 
              data-add-student-button
              onPress={handleAddStudent}
              className="ml-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
            >
              Add
            </Button>
          </div>
        </div>
        
        {students.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Students</h3>
            <ul className="border border-gray-200 rounded-md divide-y">
              {students.map((student, index) => (
                <li key={student.name} className="px-4 py-3 flex justify-between items-center">
                  <span>{student.name}</span>
                  <button
                    data-remove-student
                    onClick={() => removeStudent(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <Button 
            data-cancel-button
            onPress={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            data-save-course-button
            onPress={handleSubmit}
            isDisabled={!name || isSubmitting}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-gray-400"
          >
            Save Course
          </Button>
        </div>
      </div>
    </div>
  );
}
