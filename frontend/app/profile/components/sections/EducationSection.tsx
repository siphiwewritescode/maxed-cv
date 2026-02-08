'use client'

import { useState } from 'react'
import { EducationEntry } from '@/types/profile'
import { profileAPI } from '@/lib/profile-api'
import { Button } from '@/components/ui/button'
import { Plus, GraduationCap, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from '../shared/SortableItem'
import EducationFormDialog from './EducationFormDialog'
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog'

interface EducationSectionProps {
  education: EducationEntry[]
  onRefresh: () => void
}

export default function EducationSection({ education, onRefresh }: EducationSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedEducation, setSelectedEducation] = useState<EducationEntry | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [educationToDelete, setEducationToDelete] = useState<EducationEntry | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const handleAdd = () => {
    setSelectedEducation(null)
    setIsFormOpen(true)
  }

  const handleEdit = (entry: EducationEntry) => {
    setSelectedEducation(entry)
    setIsFormOpen(true)
  }

  const handleDelete = (entry: EducationEntry) => {
    setEducationToDelete(entry)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!educationToDelete) return

    try {
      await profileAPI.deleteEducation(educationToDelete.id)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete education:', error)
      throw error
    }
  }

  const handleSave = () => {
    onRefresh()
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = education.findIndex((item) => item.id === active.id)
      const newIndex = education.findIndex((item) => item.id === over.id)

      const reordered = arrayMove(education, oldIndex, newIndex).map((item, index) => ({
        id: item.id,
        order: index,
      }))

      try {
        await profileAPI.reorderSection('education', reordered)
        onRefresh()
      } catch (error) {
        console.error('Failed to reorder education:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short' })
  }

  const hasEducation = education.length > 0

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Education</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {/* Education List or Empty State */}
      {hasEducation ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {education.map((entry) => (
                <SortableItem key={entry.id} id={entry.id}>
                  {(dragHandleProps) => (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start gap-4">
                        {/* Drag Handle */}
                        <div {...dragHandleProps} className="cursor-move pt-1">
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {entry.institution}
                          </h3>
                          <p className="text-gray-700 mt-1">
                            {entry.degree}
                            {entry.fieldOfStudy && ` in ${entry.fieldOfStudy}`}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(entry.startDate)} -{' '}
                            {entry.endDate ? formatDate(entry.endDate) : 'Present'}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(entry)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(entry)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-gray-100 p-4">
              <GraduationCap className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No education entries yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Add your educational background to showcase your qualifications.
          </p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Education Entry
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <EducationFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        education={selectedEducation}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemType="education entry"
        itemName={educationToDelete?.institution}
      />
    </div>
  )
}
