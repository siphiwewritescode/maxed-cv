'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { educationSchema, type EducationFormData } from '@/lib/validations/profile'
import { EducationEntry } from '@/types/profile'
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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface EducationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  education: EducationEntry | null
  onSave: () => void
}

export default function EducationFormDialog({
  open,
  onOpenChange,
  education,
  onSave,
}: EducationFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: new Date(),
      endDate: undefined,
    },
  })

  useEffect(() => {
    if (education) {
      form.reset({
        institution: education.institution,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy || '',
        startDate: new Date(education.startDate),
        endDate: education.endDate ? new Date(education.endDate) : undefined,
      })
    } else {
      form.reset({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: new Date(),
        endDate: undefined,
      })
    }
  }, [education, form])

  const onSubmit = async (data: EducationFormData) => {
    try {
      setIsSaving(true)

      const payload = {
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy || undefined,
        startDate: data.startDate.toISOString().slice(0, 7), // YYYY-MM
        endDate: data.endDate ? data.endDate.toISOString().slice(0, 7) : undefined,
      }

      if (education) {
        await profileAPI.updateEducation(education.id, payload)
      } else {
        await profileAPI.addEducation(payload)
      }

      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save education:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {education ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., University of Cape Town"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Bachelor of Science"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fieldOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of Study</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Computer Science"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().slice(0, 7)
                            : ''
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value + '-01')
                            : new Date()
                          field.onChange(date)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().slice(0, 7)
                            : ''
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value + '-01')
                            : undefined
                          field.onChange(date)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
