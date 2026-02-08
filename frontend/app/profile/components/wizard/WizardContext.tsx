'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { MasterProfile } from '@/types/profile'
import { profileAPI } from '@/lib/profile-api'

export type WizardStep = 1 | 2 | 3 | 4

export type WizardContextType = {
  currentStep: WizardStep
  completedSteps: Set<number>
  profileData: MasterProfile | null
  goToStep: (step: WizardStep) => void
  markStepComplete: (step: number) => void
  setProfileData: (data: MasterProfile) => void
  refreshProfile: () => Promise<void>
  isLoading: boolean
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [profileData, setProfileData] = useState<MasterProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileAPI.getProfile()
        setProfileData(data)

        // Determine which steps are complete based on existing data
        const completed = new Set<number>()

        // Step 1 is complete if personal info is filled
        if (data.firstName && data.lastName && data.email) {
          completed.add(1)
        }

        // Step 2 is complete if at least one experience exists
        if (data.experiences && data.experiences.length > 0) {
          completed.add(2)
        }

        // Step 3 is complete if at least one education or certification exists
        if ((data.education && data.education.length > 0) ||
            (data.certifications && data.certifications.length > 0)) {
          completed.add(3)
        }

        // Step 4 is complete if at least one skill exists
        if (data.skills && data.skills.length > 0) {
          completed.add(4)
        }

        setCompletedSteps(completed)
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step)
  }

  const markStepComplete = (step: number) => {
    setCompletedSteps(prev => new Set(prev).add(step))
  }

  const refreshProfile = async () => {
    try {
      const data = await profileAPI.getProfile()
      setProfileData(data)
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        completedSteps,
        profileData,
        goToStep,
        markStepComplete,
        setProfileData,
        refreshProfile,
        isLoading,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}
