'use client'

import { ProfileWizard } from '../components/wizard/ProfileWizard'

export default function CreateProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Build your master profile to get started with AI-powered CV tailoring
          </p>
        </div>
        <ProfileWizard />
      </div>
    </div>
  )
}
