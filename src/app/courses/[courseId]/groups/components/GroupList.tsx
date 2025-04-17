"use client"

import { Group, workedTogetherAlready } from "@/domain/group"
import { Student } from "@/domain/student"
import { useState } from "react"
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
} from "@dnd-kit/core"
import { GroupSetId } from "@/domain/groupSet"
import { useGroupStore } from "@/app/contexts/GroupStoreContext"
import { getGroups } from "@/app/stores/selectors"
import { DisplayableGroupSet } from "./DisplayableGroupSet"
import { Button, Tooltip, TooltipTrigger } from "react-aria-components"

interface GroupListProps {
  groupSetId?: GroupSetId
  editable?: boolean
}

interface DragState {
  student: Student
  fromGroupIndex: number
}

function extractStudents(groups: Group[]): Student[][] {
  return groups.map((group) => Array.from(group.members))
}

function extractGroups(
  groupSetId: GroupSetId | undefined,
  groupSets: DisplayableGroupSet[],
): Group[] {
  if (groupSetId !== undefined) {
    return []
  } else {
    return groupSets.flatMap((gs) => gs.groups)
  }
}

interface DraggableStudentProps {
  student: Student
  groupIndex: number
  collaborationCount: number
  collaborators?: Student[]
}

function DraggableStudent({
  student,
  groupIndex,
  collaborationCount,
  collaborators,
  isDraggingDisabled = false,
}: DraggableStudentProps & { isDraggingDisabled?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${student.id}:${groupIndex}`,
    disabled: isDraggingDisabled,
  })

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-group-member
      className={`py-3 ${isDraggingDisabled ? "cursor-default" : "cursor-grab"} ${isDragging ? "opacity-30 bg-gray-100" : ""}`}
      style={{
        touchAction: "none",
        transform: isDragging ? "scale(1.02)" : undefined,
        boxShadow: isDragging ? "0 0 8px rgba(0, 0, 0, 0.1)" : undefined,
        position: "relative",
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      <div className="flex items-center">
        <div data-student-name className="font-medium">
          {student.name}
        </div>
        {collaborationCount > 0 &&
          collaborators &&
          collaborators.length > 0 && (
            <TooltipTrigger delay={500}>
              <Button
                data-partnered-indicator
                className="ml-2 text-xs font-medium bg-orange-100 text-orange-800 rounded-full px-1.5 py-0.5 cursor-pointer"
              >
                {collaborationCount}
              </Button>
              <Tooltip
                data-previous-collaborators
                placement="right"
                offset={10}
                className="p-2 bg-gray-800 max-w-3xs text-wrap text-white text-xs rounded shadow-lg"
              >
                Worked with: {collaborators.map((c) => c.name).join(", ")}
              </Tooltip>
            </TooltipTrigger>
          )}
      </div>
    </li>
  )
}

function DroppableGroup({
  id,
  index,
  children,
  isOver,
}: {
  id: string
  index: number
  children: React.ReactNode
  isOver?: boolean
}) {
  const { setNodeRef, isOver: dropIsOver } = useDroppable({
    id: id,
  })

  const isActiveTarget = isOver || dropIsOver

  return (
    <div
      ref={setNodeRef}
      data-student-group
      className={`bg-white shadow rounded-lg p-4 border ${isActiveTarget ? "border-blue-400 bg-blue-50" : "border-gray-200"} transition-colors duration-200`}
    >
      <h3 className="font-medium text-lg mb-2">Group {index + 1}</h3>
      <ul className="divide-y divide-gray-200">{children}</ul>
    </div>
  )
}

export default function GroupList({
  groupSetId,
  editable = true,
}: GroupListProps) {
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [overGroupId, setOverGroupId] = useState<string | null>(null)

  const groups = useGroupStore(getGroups(groupSetId))
  const studentGroups: Student[][] = extractStudents(groups)
  const setGroups = useGroupStore((state) => state.setGroupsForGroupSet)
  const history = extractGroups(
    groupSetId,
    useGroupStore((store) => store.groupSets),
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const idWithGroup = active.id as string

    const [studentId, fromGroupIndexStr] = idWithGroup.split(":")
    const fromGroupIndex = parseInt(fromGroupIndexStr)

    const student = studentGroups[fromGroupIndex].find(
      (s) => s.id === studentId,
    )!

    setDragState({
      student,
      fromGroupIndex,
    })
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event
    setOverGroupId(over ? (over.id as string) : null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event

    if (!over || !dragState) {
      setDragState(null)
      setOverGroupId(null)
      return
    }

    const { student, fromGroupIndex } = dragState
    const toGroupIndex = parseInt(over.id as string)

    setDragState(null)
    setOverGroupId(null)

    if (fromGroupIndex !== toGroupIndex) {
      const newGroups = [...studentGroups]

      newGroups[fromGroupIndex] = newGroups[fromGroupIndex].filter(
        (s) => s.id !== student.id,
      )
      newGroups[toGroupIndex] = [...newGroups[toGroupIndex], student]

      const groupsToSave: Array<Group> = newGroups.map((students) => {
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
        {groups.map((group, groupIndex) => {
          const collaborationSet = workedTogetherAlready(history, group)
          return (
            <DroppableGroup
              key={`group-${groupIndex}`}
              id={`${groupIndex}`}
              index={groupIndex}
              isOver={overGroupId === `${groupIndex}`}
            >
              {Array.from(group.members).map((student) => {
                const collaborators = collaborationSet.get(student.id)!
                return (
                  <DraggableStudent
                    key={student.id}
                    student={student}
                    groupIndex={groupIndex}
                    collaborationCount={collaborators.length}
                    collaborators={collaborators}
                    isDraggingDisabled={!editable}
                  />
                )
              })}
            </DroppableGroup>
          )
        })}

        <DragOverlay>
          {dragState && (
            <div className="py-3 bg-white border border-blue-500 shadow-lg rounded-md p-2 w-auto">
              <div className="font-medium">{dragState.student.name}</div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
