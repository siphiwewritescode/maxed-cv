'use client'

import { useState } from 'react'
import { WorkExperience } from '@/types/profile'
import { profileAPI } from '@/lib/profile-api'
import { Button } from '@/components/ui/button'
import { Plus, Briefcase } from 'lucide-react'
import SortableExperienceList from './SortableExperienceList'
import ExperienceFormDialog from './ExperienceFormDialog'
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog'

interface ExperienceSectionProps {
  experiences: WorkExperience[]
  onRefresh: () => void
}

export default function ExperienceSection({
  experiences,
  onRefresh,
}: ExperienceSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<WorkExperience | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [experienceToDelete, setExperienceToDelete] = useState<WorkExperience | null>(null)

  const handleAdd = () => {
    setSelectedExperience(null)
    setIsFormOpen(true)
  }

  const handleEdit = (experience: WorkExperience) => {
    setSelectedExperience(experience)
    setIsFormOpen(true)
  }

  const handleDelete = (experience: WorkExperience) => {
    setExperienceToDelete(experience)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!experienceToDelete) return

    try {
      await profileAPI.deleteExperience(experienceToDelete.id)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete experience:', error)
      throw error
    }
  }

  const handleSave = () => {
    onRefresh()
  }

  const hasExperiences = experiences.length > 0

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Work Experience</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Experience List or Empty State */}
      {hasExperiences ? (
        <SortableExperienceList
          experiences={experiences}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={onRefresh}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-gray-100 p-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No work experience yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Add your work history to showcase your professional journey and achievements.
          </p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Experience
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <ExperienceFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        experience={selectedExperience}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemType="work experience"
        itemName={experienceToDelete?.jobTitle}
      />
    </div>
  )
}
