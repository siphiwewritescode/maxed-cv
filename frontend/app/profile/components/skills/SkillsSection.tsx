'use client'

import { useState, useEffect, useRef } from 'react'
import { ProfileSkill } from '@/types/profile'
import { profileAPI } from '@/lib/profile-api'
import SkillsTagInput from './SkillsTagInput'
import { Check, Loader2 } from 'lucide-react'

interface SkillsSectionProps {
  skills: ProfileSkill[]
  onRefresh: () => void
}

export default function SkillsSection({ skills, onRefresh }: SkillsSectionProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleSkillsChange = async (newSkills: { name: string; order: number }[]) => {
    // Clear any existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce the save
    debounceRef.current = setTimeout(async () => {
      try {
        setIsSaving(true)
        await profileAPI.updateSkills(newSkills.map((s) => s.name))

        // Show saved indicator briefly
        setShowSaved(true)
        setTimeout(() => setShowSaved(false), 800)

        onRefresh()
      } catch (error) {
        console.error('Failed to update skills:', error)
      } finally {
        setIsSaving(false)
      }
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Skills</h2>
        <div className="flex items-center gap-2 text-sm">
          {isSaving && (
            <span className="flex items-center gap-1 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          )}
          {showSaved && (
            <span className="flex items-center gap-1 text-green-600">
              <Check className="h-4 w-4" />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Skills Tag Input */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <SkillsTagInput skills={skills} onSkillsChange={handleSkillsChange} />
      </div>
    </div>
  )
}
