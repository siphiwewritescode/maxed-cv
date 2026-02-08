'use client'

import { useState } from 'react'
import { ProjectEntry } from '@/types/profile'
import { profileAPI } from '@/lib/profile-api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Rocket, GripVertical, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from '../shared/SortableItem'
import ProjectFormDialog from './ProjectFormDialog'
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog'

interface ProjectsSectionProps {
  projects: ProjectEntry[]
  onRefresh: () => void
}

export default function ProjectsSection({ projects, onRefresh }: ProjectsSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<ProjectEntry | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const handleAdd = () => {
    setSelectedProject(null)
    setIsFormOpen(true)
  }

  const handleEdit = (project: ProjectEntry) => {
    setSelectedProject(project)
    setIsFormOpen(true)
  }

  const handleDelete = (project: ProjectEntry) => {
    setProjectToDelete(project)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return

    try {
      await profileAPI.deleteProject(projectToDelete.id)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete project:', error)
      throw error
    }
  }

  const handleSave = () => {
    onRefresh()
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((item) => item.id === active.id)
      const newIndex = projects.findIndex((item) => item.id === over.id)

      const reordered = arrayMove(projects, oldIndex, newIndex).map((item, index) => ({
        id: item.id,
        order: index,
      }))

      try {
        await profileAPI.reorderSection('projects', reordered)
        onRefresh()
      } catch (error) {
        console.error('Failed to reorder projects:', error)
      }
    }
  }

  const truncateDescription = (text: string | null, maxLength: number = 150) => {
    if (!text) return ''
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  const hasProjects = projects.length > 0

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Projects List or Empty State */}
      {hasProjects ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {projects.map((project) => (
                <SortableItem key={project.id} id={project.id}>
                  {(dragHandleProps) => (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start gap-4">
                        {/* Drag Handle */}
                        <div {...dragHandleProps} className="cursor-move pt-1">
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {project.name}
                            </h3>
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>

                          {project.description && (
                            <p className="text-gray-700 mt-2">
                              {truncateDescription(project.description)}
                            </p>
                          )}

                          {project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {project.technologies.map((tech) => (
                                <Badge key={tech} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(project)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(project)}
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
              <Rocket className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Showcase your personal or professional projects to demonstrate your skills.
          </p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <ProjectFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        project={selectedProject}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemType="project"
        itemName={projectToDelete?.name}
      />
    </div>
  )
}
