'use client'

import { useState } from 'react'
import { WorkExperience } from '@/types/profile'
import { profileAPI } from '@/lib/profile-api'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import SortableItem from '../shared/SortableItem'
import ExperienceCard from './ExperienceCard'

interface SortableExperienceListProps {
  experiences: WorkExperience[]
  onEdit: (experience: WorkExperience) => void
  onDelete: (experience: WorkExperience) => void
  onReorder: () => void
}

export default function SortableExperienceList({
  experiences,
  onEdit,
  onDelete,
  onReorder,
}: SortableExperienceListProps) {
  const [items, setItems] = useState(experiences)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      // Optimistically update local state
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)

      try {
        // Update order on backend
        const reorderPayload = newItems.map((item, index) => ({
          id: item.id,
          order: index,
        }))
        await profileAPI.reorderSection('experience', reorderPayload)
        onReorder()
      } catch (error) {
        console.error('Failed to reorder experiences:', error)
        // Revert on error
        setItems(items)
      }
    }
  }

  // Sync with parent when experiences prop changes
  useState(() => {
    setItems(experiences)
  })

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((exp) => exp.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {items.map((experience) => (
            <SortableItem key={experience.id} id={experience.id}>
              {(dragHandleProps) => (
                <ExperienceCard
                  experience={experience}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  dragHandleProps={dragHandleProps}
                />
              )}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
