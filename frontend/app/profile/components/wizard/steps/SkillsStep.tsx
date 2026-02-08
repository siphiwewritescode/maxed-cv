'use client'

import { useRouter } from 'next/navigation'
import { useWizard } from '../WizardContext'
import SkillsSection from '../../skills/SkillsSection'
import { Button } from '@/components/ui/button'

export default function SkillsStep() {
  const router = useRouter()
  const { profileData, goToStep, markStepComplete, refreshProfile } = useWizard()

  const handleFinish = () => {
    // Mark step complete
    markStepComplete(4)

    // Navigate to profile view page
    router.push('/profile')
  }

  const handleBack = () => {
    goToStep(3)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <SkillsSection
        skills={profileData?.skills || []}
        onRefresh={refreshProfile}
      />

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-8 mt-8 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleFinish}
          className="flex-1"
        >
          Finish & View Profile
        </Button>
      </div>
    </div>
  )
}
