'use client'

import { useWizard } from '../WizardContext'
import ExperienceSection from '../../experience/ExperienceSection'
import { Button } from '@/components/ui/button'

export default function ExperienceStep() {
  const { profileData, goToStep, markStepComplete, refreshProfile } = useWizard()

  const handleNext = () => {
    // Mark step complete if user has at least one experience
    if (profileData?.experiences && profileData.experiences.length > 0) {
      markStepComplete(2)
    }
    goToStep(3)
  }

  const handleBack = () => {
    goToStep(1)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <ExperienceSection
        experiences={profileData?.experiences || []}
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
          onClick={handleNext}
          className="flex-1"
        >
          Continue to Education
        </Button>
      </div>
    </div>
  )
}
