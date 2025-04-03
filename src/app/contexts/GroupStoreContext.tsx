'use client';

import React, { createContext, useContext, ReactNode } from 'react'
import type { GroupStore, createGroupStore } from '../stores/groupStore'
import { useStore } from 'zustand'

interface GroupStoreContextType {
  store: ReturnType<typeof createGroupStore>
}

const GroupStoreContext = createContext<GroupStoreContextType | null>(null)

interface GroupStoreProviderProps {
  children: ReactNode
  store: ReturnType<typeof createGroupStore>
}

export const GroupStoreProvider: React.FC<GroupStoreProviderProps> = ({ 
  children, 
  store
}) => {
  return (
    <GroupStoreContext.Provider value={{ store }}>
      {children}
    </GroupStoreContext.Provider>
  )
}

export function useGroupStore<T>(
  selector: (state: GroupStore) => T,
): T {
  const context = useContext(GroupStoreContext)
  
  if (!context) {
    throw new Error('useGroupStore must be used within a GroupStoreProvider')
  }
  
  return useStore(context.store, selector)
}
