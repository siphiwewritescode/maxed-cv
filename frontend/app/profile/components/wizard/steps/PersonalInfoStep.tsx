'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalInfoSchema, PersonalInfoFormData } from '@/lib/validations/profile'
import { profileAPI } from '@/lib/profile-api'
import { useWizard } from '../WizardContext'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function PersonalInfoStep() {
  const { profileData, goToStep, markStepComplete, setProfileData } = useWizard()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      headline: '',
      summary: '',
      noticePeriod: '',
    },
  })

  // Pre-populate form when profile data loads
  useEffect(() => {
    if (profileData) {
      form.reset({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        location: profileData.location || '',
        headline: profileData.headline || '',
        summary: profileData.summary || '',
        noticePeriod: profileData.noticePeriod || '',
      })
    }
  }, [profileData, form])

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      setIsSubmitting(true)
      const updatedProfile = await profileAPI.updatePersonalInfo(data)
      setProfileData(updatedProfile)
      markStepComplete(1)

      // Show success indicator briefly
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        goToStep(2)
      }, 800)
    } catch (error) {
      console.error('Failed to save personal info:', error)
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Failed to save personal information',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    goToStep(2)
  }

  const summaryValue = form.watch('summary') || ''
  const summaryLength = summaryValue.length
  const maxSummaryLength = 500

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Personal Information</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+27 82 123 4567" {...field} />
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
                  <Input placeholder="e.g., Cape Town, South Africa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Headline */}
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Headline</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Senior Full-Stack Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notice Period */}
          <FormField
            control={form.control}
            name="noticePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Period</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Immediately, 2 weeks, 1 month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Professional Summary */}
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Summary / Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief summary of your professional background and expertise..."
                    className="min-h-[120px]"
                    maxLength={maxSummaryLength}
                    {...field}
                  />
                </FormControl>
                <div className="flex justify-between items-center">
                  <FormMessage />
                  <p className={`text-xs ${summaryLength > maxSummaryLength ? 'text-red-500' : 'text-gray-500'}`}>
                    {summaryLength} / {maxSummaryLength}
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Form Error */}
          {form.formState.errors.root && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{form.formState.errors.root.message}</p>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">Saved successfully!</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={isSubmitting}
            >
              Skip
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
