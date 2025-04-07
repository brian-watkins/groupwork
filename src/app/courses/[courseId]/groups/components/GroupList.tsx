'use client';

import { Group, workedTogetherAlready } from "@/domain/group";
import { Student } from "@/domain/student";
import { useState, useMemo } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { GroupSetId } from "@/domain/groupSet";
import { useGroupStore } from "@/app/contexts/GroupStoreContext";
import { getGroups } from "@/app/stores/selectors";
import { DisplayableGroupSet } from "./DisplayableGroupSet";

interface GroupListProps {
  groupSetId?: GroupSetId
  editable?: boolean
}

interface DragState {
  student: Student;
  fromGroupIndex: number;
}

function extractStudents(groups: Group[]): Student[][] {
  return groups.map(group => Array.from(group.members));
}

function extractGroups(groupSetId: GroupSetId | undefined, groupSets: DisplayableGroupSet[]): Group[] {
  if (groupSetId !== undefined) {
    return []
  } else {
    return groupSets.flatMap(gs => gs.groups)
  }
}

interface DraggableStudentProps {
  student: Student,
  groupIndex: number
  hasPartners: boolean
}

function DraggableStudent({ student, groupIndex, hasPartners, isDraggingDisabled = false }: DraggableStudentProps & { isDraggingDisabled?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${student.id}:${groupIndex}`,
    disabled: isDraggingDisabled
  });

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-group-member
      className={`py-3 ${isDraggingDisabled ? 'cursor-default' : 'cursor-grab'} ${isDragging ? 'opacity-30 bg-gray-100' : ''}`}
      style={{
        touchAction: 'none',
        transform: isDragging ? 'scale(1.02)' : undefined,
        boxShadow: isDragging ? '0 0 8px rgba(0, 0, 0, 0.1)' : undefined,
        position: 'relative',
        zIndex: isDragging ? 1000 : 1
      }}
    >
      <div className="flex items-center">
        <div data-student-name className="font-medium">{student.name}</div>
        {hasPartners && (
          <div data-partnered-indicator className={`ml-2 w-2 h-2 rounded-full bg-orange-600`}></div>
        )}
      </div>
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

export default function GroupList({ groupSetId, editable = true }: GroupListProps) {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [overGroupId, setOverGroupId] = useState<string | null>(null);

  const groups = useGroupStore(getGroups(groupSetId))
  const studentGroups: Student[][] = extractStudents(groups)
  const setGroups = useGroupStore(state => state.setGroupsForGroupSet)
  const history = extractGroups(groupSetId, useGroupStore(store => store.groupSets))

  const collaborationMap = useMemo(() => {
    const result = new Map<string, boolean>();

    groups.forEach((group) => {
      const collaborators = workedTogetherAlready(history, group);
      collaborators.forEach((collaboratorGroup, index) => {
        collaboratorGroup.forEach(student => {
          result.set(student.id, true);
        });
      });
    });

    return result;
  }, [groups, history])

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
      const newGroups = [...studentGroups];

      newGroups[fromGroupIndex] = newGroups[fromGroupIndex].filter(s => s.id !== student.id);
      newGroups[toGroupIndex] = [...newGroups[toGroupIndex], student];

      const groupsToSave: Array<Group> = newGroups.map(students => {
        return { members: new Set(students) }
      })

      setGroups(groupSetId, groupsToSave)
    }
  }

  return (
    <DndContext
      onDragStart={editable ? handleDragStart : undefined}
      onDragOver={editable ? handleDragOver : undefined}
      onDragEnd={editable ? handleDragEnd : undefined}
    >
      <div data-groups className="grid grid-cols-3 gap-4">
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
                hasPartners={collaborationMap.get(student.id)!}
                isDraggingDisabled={!editable}
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