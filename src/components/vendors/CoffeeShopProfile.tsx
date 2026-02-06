import React from 'react'
import Link from 'next/link'
import type { Vendor } from '@/lib/supabase'
import { Badge, Button } from '@/components/ui'
import { OpeningHoursDisplay, OpenNowBadge } from './OpeningHoursDisplay'
import { AmenitiesDisplay } from './AmenitiesDisplay'

interface CoffeeShopProfileProps {
  vendor: Vendor
}

export function CoffeeShopProfile({ vendor }: CoffeeShopProfileProps) {
  const hasOpeningHours = vendor.opening_hours && Object.keys(vendor.opening_hours).length > 0
  const googleMapsLink = vendor.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.physical_address || vendor.business_name)}`

  return (
    <>
      {/* Hero */}
      <div className="relative h-56 sm:h-64" style={{ background: 'linear-gradient(135deg, #3B2A1A 0%, #6B4226 100%)' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-[#A0785A] flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" stroke="#F5C842" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAFAF8] to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        {/* Main Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>
                  {vendor.business_name}
                </h1>
                {vendor.verified && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 border border-blue-200">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold text-blue-700">Verified</span>
                  </div>
                )}
                {hasOpeningHours && <OpenNowBadge hours={vendor.opening_hours!} />}
              </div>

              <p className="text-neutral-600">{vendor.specialty}</p>

              {/* Address */}
              {vendor.physical_address && (
                <div className="flex items-start gap-2 mt-3 text-sm text-neutral-700">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{vendor.physical_address}</span>
                </div>
              )}

              {/* Rating */}
              {vendor.average_rating && vendor.review_count > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-sm">{vendor.average_rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-neutral-500">({vendor.review_count} reviews)</span>
                  <span className="text-sm text-neutral-400">•</span>
                  <span className="text-sm text-neutral-600">{vendor.price_range || '$$'}</span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex gap-2">
              <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#F5C842] text-[#1A1A1A] hover:bg-[#E8B430] font-semibold">
                  Get Directions
                </Button>
              </a>
              {vendor.website && (
                <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Website</Button>
                </a>
              )}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            {/* Opening Hours */}
            {hasOpeningHours && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Hours today</div>
                <OpeningHoursDisplay hours={vendor.opening_hours!} compact />
              </div>
            )}

            {/* Seating Capacity */}
            {vendor.seating_capacity && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Seating</div>
                <div className="text-lg font-bold" style={{ color: '#3B2A1A' }}>
                  {vendor.seating_capacity} seats
                </div>
              </div>
            )}

            {/* Price Range */}
            {vendor.price_range && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Price range</div>
                <div className="text-lg font-bold" style={{ color: '#3B2A1A' }}>
                  {vendor.price_range}
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">per coffee</div>
              </div>
            )}
          </div>

          {/* Full Opening Hours */}
          {hasOpeningHours && (
            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Opening hours</div>
              <OpeningHoursDisplay hours={vendor.opening_hours!} />
            </div>
          )}

          {/* Description */}
          {vendor.description && (
            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">About</div>
              <p className="text-neutral-700 leading-relaxed">{vendor.description}</p>
            </div>
          )}

          {/* Amenities */}
          <div className="mt-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Amenities</div>
            <AmenitiesDisplay
              wifi={vendor.wifi_available}
              parking={vendor.parking_available}
              outdoorSeating={vendor.outdoor_seating}
              wheelchairAccessible={vendor.wheelchair_accessible}
            />
          </div>

          {/* Tags */}
          {vendor.tags && vendor.tags.length > 0 && (
            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Specialties</div>
              <div className="flex flex-wrap gap-2">
                {vendor.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium border border-neutral-200 capitalize"
                    style={{ color: '#3B2A1A', backgroundColor: '#FAF5F0' }}
                  >
                    {tag.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Menu Link */}
          {vendor.menu_url && (
            <div className="mt-8">
              <a
                href={vendor.menu_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 hover:border-[#F5C842] hover:bg-[#FAF5F0] transition-colors text-sm font-medium"
                style={{ color: '#3B2A1A' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Menu
              </a>
            </div>
          )}
        </div>

        {/* Map Section */}
        {vendor.physical_address && (
          <div className="mt-8 bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1A1A1A' }}>Location</h2>
              <p className="text-sm text-neutral-600 mb-4">{vendor.physical_address}</p>
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F5C842] hover:bg-[#E8B430] text-[#1A1A1A] font-semibold text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Open in Google Maps
              </a>
            </div>
            {/* Placeholder for future map embed */}
            <div className="h-64 bg-neutral-100 flex items-center justify-center">
              <div className="text-center text-neutral-400">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm">Map view coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Serving Areas */}
        {vendor.suburbs && vendor.suburbs.length > 0 && (
          <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: '#FAF5F0', border: '1px solid #E5E0D8' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#1A1A1A' }}>
              Nearby Suburbs
            </h2>
            <p className="text-sm text-neutral-700 leading-relaxed mb-3">
              Located in {vendor.suburbs[0]}, also serving coffee lovers in surrounding Melbourne suburbs.
            </p>
            <div className="flex flex-wrap gap-2">
              {vendor.suburbs.map(suburb => (
                <Badge key={suburb} variant="secondary" className="text-xs">
                  {suburb}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Social & Contact */}
        {(vendor.instagram_handle || vendor.facebook_url || vendor.contact_phone) && (
          <div className="mt-8 p-6 rounded-lg border border-neutral-200 bg-white">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A1A' }}>Connect with us</h2>
            <div className="flex flex-wrap items-center gap-4">
              {vendor.contact_phone && (
                <a href={`tel:${vendor.contact_phone}`} className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-[#3B2A1A]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {vendor.contact_phone}
                </a>
              )}
              {vendor.instagram_handle && (
                <a
                  href={`https://instagram.com/${vendor.instagram_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-[#3B2A1A]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @{vendor.instagram_handle}
                </a>
              )}
              {vendor.facebook_url && (
                <a
                  href={vendor.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-[#3B2A1A]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              )}
            </div>
          </div>
        )}

        {/* Internal linking */}
        <div className="mt-8 p-6 rounded-lg border border-neutral-200 bg-white">
          <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A1A' }}>
            Explore more coffee in Melbourne
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/coffee-shops" className="group">
              <div className="p-4 rounded-lg border border-neutral-200 hover:border-[#F5C842] transition-colors">
                <div className="text-sm font-semibold mb-1 group-hover:text-[#3B2A1A]" style={{ color: '#1A1A1A' }}>
                  All Coffee Shops
                </div>
                <p className="text-xs text-neutral-600">
                  Discover more Melbourne cafes and specialty coffee shops
                </p>
              </div>
            </Link>
            <Link href={`/suburbs/${vendor.suburbs[0]?.toLowerCase().replace(/\s+/g, '-')}`} className="group">
              <div className="p-4 rounded-lg border border-neutral-200 hover:border-[#F5C842] transition-colors">
                <div className="text-sm font-semibold mb-1 group-hover:text-[#3B2A1A]" style={{ color: '#1A1A1A' }}>
                  Coffee in {vendor.suburbs[0]}
                </div>
                <p className="text-xs text-neutral-600">
                  More coffee shops and mobile carts in this suburb
                </p>
              </div>
            </Link>
            <Link href="/app" className="group">
              <div className="p-4 rounded-lg border border-neutral-200 hover:border-[#F5C842] transition-colors">
                <div className="text-sm font-semibold mb-1 group-hover:text-[#3B2A1A]" style={{ color: '#1A1A1A' }}>
                  Mobile Coffee Carts
                </div>
                <p className="text-xs text-neutral-600">
                  Book mobile baristas for your next Melbourne event
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/coffee-shops" className="text-sm text-neutral-500 hover:text-neutral-800">
            ← Back to all coffee shops
          </Link>
        </div>
      </div>
    </>
  )
}
