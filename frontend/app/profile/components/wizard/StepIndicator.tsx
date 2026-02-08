'use client'

import { Check } from 'lucide-react'
import { useWizard, WizardStep } from './WizardContext'

const steps = [
  { number: 1 as WizardStep, label: 'Personal Info' },
  { number: 2 as WizardStep, label: 'Experience' },
  { number: 3 as WizardStep, label: 'Education & Certs' },
  { number: 4 as WizardStep, label: 'Skills' },
]

export function StepIndicator() {
  const { currentStep, completedSteps, goToStep } = useWizard()

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.number)
          const isCurrent = currentStep === step.number
          const isUpcoming = !isCompleted && !isCurrent

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <button
                onClick={() => goToStep(step.number)}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full
                  font-semibold text-sm transition-all duration-200
                  ${isCompleted ? 'bg-green-600 text-white' : ''}
                  ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-200' : ''}
                  ${isUpcoming ? 'bg-gray-200 text-gray-600' : ''}
                  hover:scale-110 cursor-pointer
                `}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </button>

              {/* Step Label */}
              <div className="ml-3 flex-1">
                <p
                  className={`
                    text-sm font-medium
                    ${isCurrent ? 'text-blue-600' : ''}
                    ${isCompleted ? 'text-green-600' : ''}
                    ${isUpcoming ? 'text-gray-500' : ''}
                  `}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-0.5 flex-1 mx-4
                    ${completedSteps.has(step.number) ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
