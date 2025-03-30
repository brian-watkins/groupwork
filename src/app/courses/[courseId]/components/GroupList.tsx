'use client';

import { Group } from "@/domain/group";
import { Student } from "@/domain/student";
import { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';

interface GroupListProps {
  groups: Group[];
}

interface DragState {
  student: Student;
  fromGroupIndex: number;
}

function extractStudents(groups: Group[]): Student[][] {
  return groups.map(group => Array.from(group.members));
}

function DraggableStudent({ student, groupIndex }: { student: Student; groupIndex: number }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${student.id}:${groupIndex}`,
  });

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-group-member
      className={`py-3 cursor-grab ${isDragging ? 'opacity-30 bg-gray-100' : ''}`}
      style={{
        touchAction: 'none',
        transform: isDragging ? 'scale(1.02)' : undefined,
        boxShadow: isDragging ? '0 0 8px rgba(0, 0, 0, 0.1)' : undefined,
        position: 'relative',
        zIndex: isDragging ? 1000 : 1
      }}
    >
      <div data-student-name className="font-medium">{student.name}</div>
    </li>
  );
}

function DroppableGroup({ id, index, children, isOver }: { id: string; index: number; children: React.ReactNode; isOver?: boolean }) {
  const { setNodeRef, isOver: dropIsOver } = useDroppable({
    id: id,
  });

  const isActiveTarget = isOver || dropIsOver;

  return (
    <div
      ref={setNodeRef}
      data-student-group
      className={`bg-white shadow rounded-lg p-4 border ${isActiveTarget ? 'border-blue-400 bg-blue-50' : 'border-gray-200'} transition-colors duration-200`}
    >
      <h3 className="font-medium text-lg mb-2">Group {index + 1}</h3>
      <ul className="divide-y divide-gray-200">
        {children}
      </ul>
    </div>
  );
}

export default function GroupList({ groups }: GroupListProps) {
  const [studentGroups, setStudentGroups] = useState<Student[][]>(() => extractStudents(groups));
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [overGroupId, setOverGroupId] = useState<string | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const idWithGroup = active.id as string;

    const [studentId, fromGroupIndexStr] = idWithGroup.split(':');
    const fromGroupIndex = parseInt(fromGroupIndexStr);

    const student = studentGroups[fromGroupIndex].find(s => s.id === studentId)!

    setDragState({
      student,
      fromGroupIndex
    });
  }

  function handleDragOver(event: any) {
    const { over } = event;
    setOverGroupId(over ? over.id as string : null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;

    if (!over || !dragState) {
      setDragState(null);
      setOverGroupId(null);
      return;
    }

    const { student, fromGroupIndex } = dragState;
    const toGroupIndex = parseInt(over.id as string);

    setDragState(null);
    setOverGroupId(null);

    if (fromGroupIndex !== toGroupIndex) {
      setStudentGroups(prev => {
        const newGroups = [...prev];

        newGroups[fromGroupIndex] = newGroups[fromGroupIndex].filter(s => s.id !== student.id);
        newGroups[toGroupIndex] = [...newGroups[toGroupIndex], student];

        return newGroups;
      });
    }
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div data-groups className="space-y-6">
        {studentGroups.map((groupMembers, index) => (
          <DroppableGroup
            key={`group-${index}`}
            id={`${index}`}
            index={index}
            isOver={overGroupId === `${index}`}
          >
            {groupMembers.map(student => (
              <DraggableStudent
                key={student.id}
                student={student}
                groupIndex={index}
              />
            ))}
          </DroppableGroup>
        ))}

        <DragOverlay>
          {dragState && (
            <div className="py-3 bg-white border border-blue-500 shadow-lg rounded-md p-2 w-auto">
              <div className="font-medium">{dragState.student.name}</div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}