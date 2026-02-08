'use client'

import { useState } from 'react'
import { WorkExperience } from '@/types/profile'
import { format } from 'date-fns'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ExperienceCardProps {
  experience: WorkExperience
  onEdit: (experience: WorkExperience) => void
  onDelete: (experience: WorkExperience) => void
  dragHandleProps?: any
}

export default function ExperienceCard({
  experience,
  onEdit,
  onDelete,
  dragHandleProps,
}: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDateRange = () => {
    const start = format(new Date(experience.startDate), 'MMM yyyy')
    const end = experience.current
      ? 'Present'
      : experience.endDate
      ? format(new Date(experience.endDate), 'MMM yyyy')
      : 'Present'
    return `${start} - ${end}`
  }

  // Show first 3 bullet points by default
  const visibleBulletPoints = isExpanded
    ? experience.bulletPoints
    : experience.bulletPoints.slice(0, 3)
  const hasMore = experience.bulletPoints.length > 3

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-3">
          {/* Drag Handle */}
          <div
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0"
            {...dragHandleProps}
          >
            <GripVertical className="h-5 w-5 mt-1" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex justify-between items-start gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {experience.jobTitle}
                </h3>
                <p className="text-base text-gray-700">{experience.company}</p>
                <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                  <span>{formatDateRange()}</span>
                  {experience.location && (
                    <>
                      <span>•</span>
                      <span>{experience.location}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(experience)}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(experience)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bullet Points */}
            {experience.bulletPoints.length > 0 && (
              <div className="mt-3">
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {visibleBulletPoints.map((point, index) => (
                    <li key={index} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Expand/Collapse Toggle */}
                {hasMore && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {isExpanded
                      ? 'Show less'
                      : `Show ${experience.bulletPoints.length - 3} more...`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
