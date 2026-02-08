'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@/lib/validations/profile'
import { ProjectEntry } from '@/types/profile'
import { profileAPI } from '@/lib/profile-api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectEntry | null
  onSave: () => void
}

export default function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSave,
}: ProjectFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [techInput, setTechInput] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      technologies: [],
      url: '',
    },
  })

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || '',
        technologies: project.technologies,
        url: project.url || '',
      })
      setTechnologies(project.technologies)
    } else {
      form.reset({
        name: '',
        description: '',
        technologies: [],
        url: '',
      })
      setTechnologies([])
    }
  }, [project, form])

  const addTechnology = () => {
    const trimmed = techInput.trim()
    if (trimmed && !technologies.includes(trimmed)) {
      const newTechs = [...technologies, trimmed]
      setTechnologies(newTechs)
      form.setValue('technologies', newTechs)
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    const newTechs = technologies.filter((t) => t !== tech)
    setTechnologies(newTechs)
    form.setValue('technologies', newTechs)
  }

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTechnology()
    }
  }

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSaving(true)

      const payload = {
        name: data.name,
        description: data.description || undefined,
        technologies: technologies,
        url: data.url || undefined,
      }

      if (project) {
        await profileAPI.updateProject(project.id, payload)
      } else {
        await profileAPI.addProject(payload)
      }

      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save project:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Project' : 'Add Project'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., E-commerce Platform"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the project..."
                      rows={4}
                      maxLength={1000}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/1000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Technologies Used</FormLabel>
              <div className="space-y-2">
                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                    placeholder="e.g., React, Node.js, PostgreSQL"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTechnology}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <FormDescription>
                Press Enter or click Add to add a technology
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://github.com/username/project"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
