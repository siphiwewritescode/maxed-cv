'use client'

import { useState, useRef, useEffect } from 'react'
import { ProfileSkill } from '@/types/profile'
import { suggestSkills, normalizeSkill } from '@/lib/skills-database'
import { Badge } from '@/components/ui/badge'
import { X, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from '../shared/SortableItem'

interface SkillsTagInputProps {
  skills: ProfileSkill[]
  onSkillsChange: (skills: { name: string; order: number }[]) => void
}

export default function SkillsTagInput({ skills, onSkillsChange }: SkillsTagInputProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  // Debounced suggestions
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (input.trim().length === 0) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      const results = suggestSkills(input, 5)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setSelectedIndex(-1)
    }, 150)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [input])

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addSkill = (skillName: string) => {
    const normalized = normalizeSkill(skillName)

    // Check for duplicates (case-insensitive)
    const isDuplicate = skills.some(
      (skill) => skill.name.toLowerCase() === normalized.toLowerCase()
    )

    if (!isDuplicate && normalized.trim().length > 0) {
      const maxOrder = skills.reduce((max, skill) => Math.max(max, skill.order), -1)
      const newSkills = [...skills, { name: normalized, order: maxOrder + 1 }].map((skill, index) => ({
        name: skill.name,
        order: index,
      }))
      onSkillsChange(newSkills)
    }

    setInput('')
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const removeSkill = (skillName: string) => {
    const newSkills = skills
      .filter((skill) => skill.name !== skillName)
      .map((skill, index) => ({
        name: skill.name,
        order: index,
      }))
    onSkillsChange(newSkills)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        addSkill(suggestions[selectedIndex])
      } else if (input.trim().length > 0) {
        addSkill(input)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex((skill) => skill.id === active.id)
      const newIndex = skills.findIndex((skill) => skill.id === over.id)

      const reordered = arrayMove(skills, oldIndex, newIndex).map((skill, index) => ({
        name: skill.name,
        order: index,
      }))

      onSkillsChange(reordered)
    }
  }

  return (
    <div className="space-y-3">
      {/* Skills Tags Display */}
      {skills.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={skills.map((s) => s.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <SortableItem key={skill.id} id={skill.id}>
                  {(dragHandleProps) => (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1 cursor-move"
                    >
                      <GripVertical
                        {...dragHandleProps}
                        className="h-3 w-3 text-gray-400"
                      />
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.name)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                        aria-label={`Remove ${skill.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => input.trim().length > 0 && setShowSuggestions(suggestions.length > 0)}
          placeholder={skills.length === 0 ? "Start typing to add skills (e.g., JavaScript, Python, AWS...)" : "Add more skills..."}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addSkill(suggestion)}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                  index === selectedIndex ? 'bg-gray-100' : ''
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
