'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { GripVertical, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface BulletPointItemProps {
  id: string
  index: number
  onRemove: () => void
  canRemove: boolean
}

function BulletPointItem({ id, index, onRemove, canRemove }: BulletPointItemProps) {
  const form = useFormContext()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 items-start">
      <button
        type="button"
        className="mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <FormField
        control={form.control}
        name={`bulletPoints.${index}`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Textarea
                placeholder="Describe an achievement or responsibility..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="mt-2 text-gray-400 hover:text-red-600"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

export default function BulletPointList() {
  const form = useFormContext()
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'bulletPoints',
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id)
      const newIndex = fields.findIndex((field) => field.id === over.id)
      move(oldIndex, newIndex)
    }
  }

  const handleAdd = () => {
    append('')
  }

  const canRemove = fields.length > 1

  return (
    <div className="space-y-4">
      <FormLabel>
        Achievements & Responsibilities <span className="text-red-500">*</span>
      </FormLabel>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {fields.map((field, index) => (
              <BulletPointItem
                key={field.id}
                id={field.id}
                index={index}
                onRemove={() => remove(index)}
                canRemove={canRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Achievement
      </Button>
    </div>
  )
}
