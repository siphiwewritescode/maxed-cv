'use client'

import { WizardProvider, useWizard } from './WizardContext'
import { StepIndicator } from './StepIndicator'
import PersonalInfoStep from './steps/PersonalInfoStep'
import ExperienceStep from './steps/ExperienceStep'

function WizardContent() {
  const { currentStep, isLoading } = useWizard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <StepIndicator />
      <div className="max-w-4xl mx-auto mt-8">
        {currentStep === 1 && <PersonalInfoStep />}
        {currentStep === 2 && <ExperienceStep />}
        {currentStep === 3 && (
          <div className="p-8 border rounded-lg bg-gray-50 text-center">
            <p className="text-gray-600">Education & Certifications step coming soon</p>
          </div>
        )}
        {currentStep === 4 && (
          <div className="p-8 border rounded-lg bg-gray-50 text-center">
            <p className="text-gray-600">Skills step coming soon</p>
          </div>
        )}
      </div>
    </>
  )
}

export function ProfileWizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  )
}
