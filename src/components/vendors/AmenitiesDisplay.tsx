import React from 'react'

interface AmenitiesDisplayProps {
  wifi?: boolean
  parking?: boolean
  outdoorSeating?: boolean
  wheelchairAccessible?: boolean
  compact?: boolean
}

const AMENITIES = [
  {
    key: 'wifi',
    label: 'WiFi',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
  {
    key: 'parking',
    label: 'Parking',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  {
    key: 'outdoorSeating',
    label: 'Outdoor Seating',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
  },
  {
    key: 'wheelchairAccessible',
    label: 'Wheelchair Accessible',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export function AmenitiesDisplay({
  wifi,
  parking,
  outdoorSeating,
  wheelchairAccessible,
  compact = false,
}: AmenitiesDisplayProps) {
  const amenitiesMap: Record<string, boolean> = {
    wifi: wifi || false,
    parking: parking || false,
    outdoorSeating: outdoorSeating || false,
    wheelchairAccessible: wheelchairAccessible || false,
  }

  const activeAmenities = AMENITIES.filter((amenity) => amenitiesMap[amenity.key])

  if (activeAmenities.length === 0) {
    return null
  }

  if (compact) {
    // Compact view: Just icons with tooltips
    return (
      <div className="flex items-center gap-2">
        {activeAmenities.map((amenity) => (
          <div
            key={amenity.key}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-600"
            title={amenity.label}
          >
            {amenity.icon}
          </div>
        ))}
      </div>
    )
  }

  // Full view: Icons with labels
  return (
    <div className="grid grid-cols-2 gap-3">
      {activeAmenities.map((amenity) => (
        <div key={amenity.key} className="flex items-center gap-2 text-sm text-neutral-600">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100">
            {amenity.icon}
          </div>
          <span>{amenity.label}</span>
        </div>
      ))}
    </div>
  )
}

// Alternative: Badge-style amenities
export function AmenitiesBadges({
  wifi,
  parking,
  outdoorSeating,
  wheelchairAccessible,
}: AmenitiesDisplayProps) {
  const amenitiesMap: Record<string, boolean> = {
    wifi: wifi || false,
    parking: parking || false,
    outdoorSeating: outdoorSeating || false,
    wheelchairAccessible: wheelchairAccessible || false,
  }

  const activeAmenities = AMENITIES.filter((amenity) => amenitiesMap[amenity.key])

  if (activeAmenities.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeAmenities.map((amenity) => (
        <span
          key={amenity.key}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
        >
          {amenity.icon}
          {amenity.label}
        </span>
      ))}
    </div>
  )
}
