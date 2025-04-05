import { CourseDetails } from '@/domain/courseWriter';
import { Student } from '@/domain/student';
import { create } from 'zustand';
import { createCourse } from './actions/createCourse';

interface CourseState {
  name: string;
  students: Student[];
  setName: (name: string) => void;
  addStudent: (name: string) => void;
  removeStudent: (index: number) => void;
  createCourse: () => Promise<void>
  reset: () => void;
}

let studentCounter = 0;

export const useCourseStore = create<CourseState>((set, get) => ({
  name: '',
  students: [],

  setName: (name) => set({ name }),

  addStudent: (name) => set((state) => ({
    students: [
      ...state.students,
      { id: `temp-${++studentCounter}`, name }
    ]
  })),

  removeStudent: (index) => set((state) => {
    const students = Array.from(state.students)
    students.splice(index, 1)
    return {
      students
    }
  }),

  async createCourse() {
    await createCourse({
      name: get().name,
      students: get().students
    })
    get().reset()
  },

  reset: () => {
    studentCounter = 0;
    set({
      name: '',
      students: []
    });
  }
}));
