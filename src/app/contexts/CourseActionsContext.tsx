'use client';

import React, { createContext, useContext, ReactNode } from 'react'

export type CreateCourseAction = (name: string, students: Array<string>) => Promise<void>

export interface CourseActions {
  createCourse: CreateCourseAction
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