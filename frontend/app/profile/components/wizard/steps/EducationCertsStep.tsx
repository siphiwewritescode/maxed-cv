'use client'

import { useWizard } from '../WizardContext'
import EducationSection from '../../sections/EducationSection'
import CertificationsSection from '../../sections/CertificationsSection'
import { Button } from '@/components/ui/button'

export default function EducationCertsStep() {
  const { profileData, goToStep, markStepComplete, refreshProfile } = useWizard()

  const handleNext = () => {
    // Mark step complete if user has at least one education or certification
    if (
      (profileData?.education && profileData.education.length > 0) ||
      (profileData?.certifications && profileData.certifications.length > 0)
    ) {
      markStepComplete(3)
    }
    goToStep(4)
  }

  const handleBack = () => {
    goToStep(2)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="space-y-12">
        {/* Education Section */}
        <EducationSection
          education={profileData?.education || []}
          onRefresh={refreshProfile}
        />

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Certifications Section */}
        <CertificationsSection
          certifications={profileData?.certifications || []}
          onRefresh={refreshProfile}
        />
      </div>

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
          Continue to Skills
        </Button>
      </div>
    </div>
  )
}
