-- Migration 000: Add vendor_type and coffee shop fields (Epic 4)
-- This migration was missing - adds support for mobile_cart, coffee_shop, barista types
-- Run this BEFORE migration 001

-- Add vendor_type column (defaults to mobile_cart for existing records)
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS vendor_type TEXT DEFAULT 'mobile_cart' CHECK (vendor_type IN ('mobile_cart', 'coffee_shop', 'barista'));

-- Add updated_at timestamp
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Coffee shop specific fields
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS physical_address TEXT,
ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS opening_hours JSONB,
ADD COLUMN IF NOT EXISTS seating_capacity INTEGER,
ADD COLUMN IF NOT EXISTS wifi_available BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS parking_available BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS outdoor_seating BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS wheelchair_accessible BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS menu_url TEXT,
ADD COLUMN IF NOT EXISTS menu_items JSONB,
ADD COLUMN IF NOT EXISTS price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(2, 1),
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT;

-- AI-enhanced fields (pre-Phase 1 fields that already exist in codebase)
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS ai_bio TEXT,
ADD COLUMN IF NOT EXISTS ai_specialties TEXT[],
ADD COLUMN IF NOT EXISTS ai_target_events TEXT[],
ADD COLUMN IF NOT EXISTS ai_usp TEXT;

-- Create index on vendor_type for filtering
CREATE INDEX IF NOT EXISTS idx_vendors_type ON vendors(vendor_type);

-- Add column comments
COMMENT ON COLUMN vendors.vendor_type IS 'Type of vendor: mobile_cart, coffee_shop, or barista';
COMMENT ON COLUMN vendors.opening_hours IS 'JSON object: {monday: {open: "07:00", close: "15:00"}, ...}';
COMMENT ON COLUMN vendors.menu_items IS 'JSON array of menu items with name, description, price, category';
COMMENT ON COLUMN vendors.ai_bio IS 'AI-generated bio for vendor profile';
COMMENT ON COLUMN vendors.ai_specialties IS 'AI-extracted specialties array';
COMMENT ON COLUMN vendors.ai_target_events IS 'AI-suggested target event types';
COMMENT ON COLUMN vendors.ai_usp IS 'AI-generated unique selling proposition';
