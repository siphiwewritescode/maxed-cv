'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { certificationSchema, type CertificationFormData } from '@/lib/validations/profile'
import { CertificationEntry } from '@/types/profile'
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

interface CertificationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certification: CertificationEntry | null
  onSave: () => void
}

export default function CertificationFormDialog({
  open,
  onOpenChange,
  certification,
  onSave,
}: CertificationFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: '',
      issuer: '',
      issueDate: undefined,
      credentialId: '',
    },
  })

  useEffect(() => {
    if (certification) {
      form.reset({
        name: certification.name,
        issuer: certification.issuer,
        issueDate: certification.issueDate ? new Date(certification.issueDate) : undefined,
        credentialId: certification.credentialId || '',
      })
    } else {
      form.reset({
        name: '',
        issuer: '',
        issueDate: undefined,
        credentialId: '',
      })
    }
  }, [certification, form])

  const onSubmit = async (data: CertificationFormData) => {
    try {
      setIsSaving(true)

      const payload = {
        name: data.name,
        issuer: data.issuer,
        issueDate: data.issueDate ? data.issueDate.toISOString().slice(0, 7) : undefined,
        credentialId: data.credentialId || undefined,
      }

      if (certification) {
        await profileAPI.updateCertification(certification.id, payload)
      } else {
        await profileAPI.addCertification(payload)
      }

      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save certification:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {certification ? 'Edit Certification' : 'Add Certification'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., AWS Solutions Architect Associate"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Amazon Web Services"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
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

            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., ABC123XYZ"
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
