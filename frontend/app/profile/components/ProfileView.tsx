'use client'

import { useState, useEffect } from 'react'
import { MasterProfile } from '@/types/profile'
import { profileAPI } from '@/lib/profile-api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  Edit,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import ExperienceSection from './experience/ExperienceSection'
import SkillsSection from './skills/SkillsSection'
import EducationSection from './sections/EducationSection'
import ProjectsSection from './sections/ProjectsSection'
import CertificationsSection from './sections/CertificationsSection'

export default function ProfileView() {
  const [profile, setProfile] = useState<MasterProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await profileAPI.getProfile()
      setProfile(data)
    } catch (err) {
      console.error('Failed to load profile:', err)
      setError('Failed to load profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error || 'Profile not found'}</p>
          <Button onClick={loadProfile} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Calculate completion status
  const sections = [
    { name: 'Personal Info', complete: !!(profile.firstName && profile.lastName && profile.email) },
    { name: 'Skills', complete: profile.skills.length > 0 },
    { name: 'Experience', complete: profile.experiences.length > 0 },
    { name: 'Education', complete: profile.education.length > 0 },
    { name: 'Projects', complete: profile.projects.length > 0 },
    { name: 'Certifications', complete: profile.certifications.length > 0 },
  ]
  const completedSections = sections.filter(s => s.complete).length
  const totalSections = sections.length

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={completedSections === totalSections ? 'default' : 'secondary'}>
                {completedSections} of {totalSections} sections filled
              </Badge>
              {completedSections === totalSections && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>
          <Link href="/profile/create">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit with Wizard
            </Button>
          </Link>
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6" />
            Personal Information
          </h2>
          <Link href="/profile/create?step=1">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium text-gray-900">
              {profile.firstName} {profile.lastName}
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{profile.email}</p>
            </div>
          </div>

          {profile.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{profile.phone}</p>
              </div>
            </div>
          )}

          {profile.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{profile.location}</p>
              </div>
            </div>
          )}

          {profile.noticePeriod && (
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Notice Period</p>
                <p className="font-medium text-gray-900">{profile.noticePeriod}</p>
              </div>
            </div>
          )}
        </div>

        {profile.headline && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">Headline</p>
            <p className="font-medium text-gray-900">{profile.headline}</p>
          </div>
        )}

        {profile.summary && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">Professional Summary</p>
            <p className="text-gray-900 whitespace-pre-wrap">{profile.summary}</p>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <SkillsSection
          skills={profile.skills}
          onRefresh={loadProfile}
        />
      </div>

      {/* Work Experience Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <ExperienceSection
          experiences={profile.experiences}
          onRefresh={loadProfile}
        />
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <EducationSection
          education={profile.education}
          onRefresh={loadProfile}
        />
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <ProjectsSection
          projects={profile.projects}
          onRefresh={loadProfile}
        />
      </div>

      {/* Certifications Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <CertificationsSection
          certifications={profile.certifications}
          onRefresh={loadProfile}
        />
      </div>
    </div>
  )
}
