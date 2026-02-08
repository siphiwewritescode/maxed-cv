'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workExperienceSchema, WorkExperienceFormData } from '@/lib/validations/profile'
import { profileAPI } from '@/lib/profile-api'
import { WorkExperience } from '@/types/profile'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import BulletPointList from './BulletPointList'

interface ExperienceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  experience?: WorkExperience | null
  onSave: () => void
}

export default function ExperienceFormDialog({
  open,
  onOpenChange,
  experience,
  onSave,
}: ExperienceFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!experience

  const form = useForm({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      jobTitle: '',
      company: '',
      location: '',
      startDate: undefined as Date | undefined,
      endDate: undefined as Date | undefined,
      current: false,
      bulletPoints: [''],
    },
  })

  // Watch current checkbox to disable/enable end date
  const isCurrent = form.watch('current')

  // Pre-populate form when editing
  useEffect(() => {
    if (open && experience) {
      form.reset({
        jobTitle: experience.jobTitle,
        company: experience.company,
        location: experience.location || '',
        startDate: new Date(experience.startDate),
        endDate: experience.endDate ? new Date(experience.endDate) : undefined,
        current: experience.current,
        bulletPoints: experience.bulletPoints.length > 0 ? experience.bulletPoints : [''],
      })
    } else if (open && !experience) {
      // Reset to empty form when adding new
      form.reset({
        jobTitle: '',
        company: '',
        location: '',
        startDate: undefined,
        endDate: undefined,
        current: false,
        bulletPoints: [''],
      })
    }
  }, [open, experience, form])

  // Clear end date when current is checked
  useEffect(() => {
    if (isCurrent) {
      form.setValue('endDate', undefined)
    }
  }, [isCurrent, form])

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)

      // Convert dates to ISO strings and filter empty bullet points
      const payload = {
        jobTitle: data.jobTitle,
        company: data.company,
        location: data.location || undefined,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate ? data.endDate.toISOString() : undefined,
        current: data.current,
        bulletPoints: data.bulletPoints.filter((bp: string) => bp.trim() !== ''),
      }

      if (isEditing) {
        await profileAPI.updateExperience(experience.id, payload)
      } else {
        await profileAPI.addExperience(payload)
      }

      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save experience:', error)
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Failed to save experience',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Work Experience</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your work experience details'
              : 'Add a new position to your work history'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Job Title */}
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Job Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company */}
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Takealot" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Johannesburg, South Africa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Start Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        {...field}
                        value={
                          field.value
                            ? `${field.value.getFullYear()}-${String(field.value.getMonth() + 1).padStart(2, '0')}`
                            : ''
                        }
                        onChange={(e) => {
                          const [year, month] = e.target.value.split('-')
                          if (year && month) {
                            field.onChange(new Date(parseInt(year), parseInt(month) - 1, 1))
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        disabled={isCurrent}
                        {...field}
                        value={
                          field.value && !isCurrent
                            ? `${field.value.getFullYear()}-${String(field.value.getMonth() + 1).padStart(2, '0')}`
                            : ''
                        }
                        onChange={(e) => {
                          const [year, month] = e.target.value.split('-')
                          if (year && month) {
                            field.onChange(new Date(parseInt(year), parseInt(month) - 1, 1))
                          } else {
                            field.onChange(undefined)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Current Position Checkbox */}
            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I currently work here</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Bullet Points */}
            <BulletPointList />

            {/* Form Error */}
            {form.formState.errors.root && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{form.formState.errors.root.message}</p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
