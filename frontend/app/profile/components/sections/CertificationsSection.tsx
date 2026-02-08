'use client'

import { useState } from 'react'
import { CertificationEntry } from '@/types/profile'
import { profileAPI } from '@/lib/profile-api'
import { Button } from '@/components/ui/button'
import { Plus, Award, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from '../shared/SortableItem'
import CertificationFormDialog from './CertificationFormDialog'
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog'

interface CertificationsSectionProps {
  certifications: CertificationEntry[]
  onRefresh: () => void
}

export default function CertificationsSection({ certifications, onRefresh }: CertificationsSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCertification, setSelectedCertification] = useState<CertificationEntry | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [certificationToDelete, setCertificationToDelete] = useState<CertificationEntry | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const handleAdd = () => {
    setSelectedCertification(null)
    setIsFormOpen(true)
  }

  const handleEdit = (certification: CertificationEntry) => {
    setSelectedCertification(certification)
    setIsFormOpen(true)
  }

  const handleDelete = (certification: CertificationEntry) => {
    setCertificationToDelete(certification)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!certificationToDelete) return

    try {
      await profileAPI.deleteCertification(certificationToDelete.id)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete certification:', error)
      throw error
    }
  }

  const handleSave = () => {
    onRefresh()
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = certifications.findIndex((item) => item.id === active.id)
      const newIndex = certifications.findIndex((item) => item.id === over.id)

      const reordered = arrayMove(certifications, oldIndex, newIndex).map((item, index) => ({
        id: item.id,
        order: index,
      }))

      try {
        await profileAPI.reorderSection('certifications', reordered)
        onRefresh()
      } catch (error) {
        console.error('Failed to reorder certifications:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short' })
  }

  const hasCertifications = certifications.length > 0

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Certifications</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {/* Certifications List or Empty State */}
      {hasCertifications ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={certifications.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {certifications.map((certification) => (
                <SortableItem key={certification.id} id={certification.id}>
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
                            {certification.name}
                          </h3>
                          <p className="text-gray-700 mt-1">
                            {certification.issuer}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                            {certification.issueDate && (
                              <span>Issued: {formatDate(certification.issueDate)}</span>
                            )}
                            {certification.credentialId && (
                              <span>ID: {certification.credentialId}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(certification)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(certification)}
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
              <Award className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No certifications yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Add professional certifications to strengthen your profile and demonstrate expertise.
          </p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Certification
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <CertificationFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        certification={selectedCertification}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemType="certification"
        itemName={certificationToDelete?.name}
      />
    </div>
  )
}
