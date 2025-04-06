'use client';

import React, { createContext, useContext, ReactNode } from 'react'

import { Course } from '@/domain/course';

export type CreateCourseAction = (name: string, students: Array<string>) => Promise<void>
export type UpdateCourseAction = (course: Course) => Promise<void>

export interface CourseActions {
  createCourse: CreateCourseAction
  updateCourse: UpdateCourseAction
}

interface CourseActionsContextType {
  actions: CourseActions
}

const CourseActionsContext = createContext<CourseActionsContextType | null>(null)

interface CourseActionsProviderProps {
  children: ReactNode
  actions: CourseActions
}

export const CourseActionsProvider: React.FC<CourseActionsProviderProps> = ({
  children,
  actions
}) => {
  return (
    <CourseActionsContext.Provider value={{ actions }}>
      {children}
    </CourseActionsContext.Provider>
  )
}

export function useCreateCourseAction(): CreateCourseAction {
  const context = useContext(CourseActionsContext)

  if (!context) {
    throw new Error('useCreateCourseAction must be used within a CourseActionsProvider')
  }

  return context.actions.createCourse
}

export function useUpdateCourseAction(): UpdateCourseAction {
  const context = useContext(CourseActionsContext)

  if (!context) {
    throw new Error('useUpdateCourseAction must be used within a CourseActionsProvider')
  }

  return context.actions.updateCourse
}