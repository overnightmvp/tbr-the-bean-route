import React from 'react'
import type { OpeningHours } from '@/lib/supabase'

interface OpeningHoursDisplayProps {
  hours: OpeningHours
  compact?: boolean
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
}

const DAY_LABELS_FULL: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

function formatTime(time: string): string {
  // Convert 24h to 12h format
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours, 10)
  const ampm = h >= 12 ? 'pm' : 'am'
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayHour}:${minutes}${ampm}`
}

function getCurrentDay(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
}

function groupConsecutiveDays(hours: OpeningHours): Array<{ days: string[]; hours: { open: string; close: string } | null }> {
  const groups: Array<{ days: string[]; hours: { open: string; close: string } | null }> = []
  let currentGroup: string[] = []
  let currentHours: { open: string; close: string } | null = null

  for (const day of DAY_ORDER) {
    const dayHours = hours[day]
    const hoursString = dayHours ? `${dayHours.open}-${dayHours.close}` : null

    if (currentHours === null && dayHours === undefined) {
      // Closed day, continue
      if (currentGroup.length > 0) {
        groups.push({ days: currentGroup, hours: currentHours })
        currentGroup = []
      }
      continue
    }

    const prevHoursString = currentHours ? `${currentHours.open}-${currentHours.close}` : null

    if (hoursString === prevHoursString) {
      // Same hours, add to current group
      currentGroup.push(day)
    } else {
      // Different hours, start new group
      if (currentGroup.length > 0) {
        groups.push({ days: currentGroup, hours: currentHours })
      }
      currentGroup = [day]
      currentHours = dayHours || null
    }
  }

  // Add final group
  if (currentGroup.length > 0) {
    groups.push({ days: currentGroup, hours: currentHours })
  }

  return groups
}

export function OpeningHoursDisplay({ hours, compact = false }: OpeningHoursDisplayProps) {
  const currentDay = getCurrentDay()
  const todayHours = hours[currentDay as keyof OpeningHours]

  if (compact) {
    // Compact view: Show just today's hours or next available
    if (!todayHours) {
      // Find next open day
      const dayIndex = DAY_ORDER.indexOf(currentDay as any)
      let nextOpenDay = null
      for (let i = 1; i < 7; i++) {
        const checkDay = DAY_ORDER[(dayIndex + i) % 7]
        if (hours[checkDay]) {
          nextOpenDay = { day: checkDay, hours: hours[checkDay]! }
          break
        }
      }

      if (!nextOpenDay) {
        return <span className="text-sm text-neutral-500">Closed</span>
      }

      return (
        <span className="text-sm text-neutral-600">
          Opens {DAY_LABELS_FULL[nextOpenDay.day]} {formatTime(nextOpenDay.hours.open)}
        </span>
      )
    }

    return (
      <span className="text-sm text-neutral-900 font-medium">
        {formatTime(todayHours.open)} – {formatTime(todayHours.close)}
      </span>
    )
  }

  // Full view: Show all days, grouped by same hours
  const groups = groupConsecutiveDays(hours)

  return (
    <div className="space-y-2">
      {groups.map((group, index) => {
        const dayRange =
          group.days.length === 1
            ? DAY_LABELS_FULL[group.days[0]]
            : group.days.length === 2
            ? `${DAY_LABELS_FULL[group.days[0]]} & ${DAY_LABELS_FULL[group.days[1]]}`
            : `${DAY_LABELS_FULL[group.days[0]]} – ${DAY_LABELS_FULL[group.days[group.days.length - 1]]}`

        const isToday = group.days.includes(currentDay)

        return (
          <div
            key={index}
            className={`flex justify-between text-sm ${isToday ? 'font-semibold text-[#3B2A1A]' : 'text-neutral-600'}`}
          >
            <span>{dayRange}</span>
            {group.hours ? (
              <span>
                {formatTime(group.hours.open)} – {formatTime(group.hours.close)}
              </span>
            ) : (
              <span className="text-neutral-400">Closed</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Helper component for "Open Now" badge
export function OpenNowBadge({ hours }: { hours: OpeningHours }) {
  const currentDay = getCurrentDay()
  const todayHours = hours[currentDay as keyof OpeningHours]

  if (!todayHours) {
    return null
  }

  const now = new Date()
  const currentTime = now.toTimeString().slice(0, 5) // "HH:MM"
  const isOpen = currentTime >= todayHours.open && currentTime <= todayHours.close

  if (!isOpen) {
    return null
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
      <span className="w-2 h-2 rounded-full bg-green-600" />
      Open now
    </span>
  )
}
