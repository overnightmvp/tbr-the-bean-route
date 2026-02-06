-- Migration: Add Coffee Shop Support to Vendors Table
-- Date: 2026-02-05
-- Description: Extends vendors table to support both mobile coffee carts and coffee shops

-- ============================================================
-- PHASE 1: Add vendor type discrimination
-- ============================================================

-- Add vendor_type column (mobile_cart or coffee_shop)
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS vendor_type TEXT DEFAULT 'mobile_cart';

-- Add constraint to ensure valid vendor types
ALTER TABLE vendors ADD CONSTRAINT vendor_type_check
  CHECK (vendor_type IN ('mobile_cart', 'coffee_shop'));

-- Update existing vendors to be mobile carts
UPDATE vendors SET vendor_type = 'mobile_cart' WHERE vendor_type IS NULL;

-- ============================================================
-- PHASE 2: Add coffee shop specific fields
-- ============================================================

-- Physical location
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS physical_address TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Operating hours (JSON format for flexibility)
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS opening_hours JSONB;
-- Example structure:
-- {
--   "monday": {"open": "07:00", "close": "16:00"},
--   "tuesday": {"open": "07:00", "close": "16:00"},
--   "wednesday": {"open": "07:00", "close": "16:00"},
--   "thursday": {"open": "07:00", "close": "16:00"},
--   "friday": {"open": "07:00", "close": "16:00"},
--   "saturday": {"open": "08:00", "close": "17:00"},
--   "sunday": {"open": "08:00", "close": "17:00"}
-- }

-- Capacity and amenities
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS seating_capacity INTEGER;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS wifi_available BOOLEAN DEFAULT false;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS parking_available BOOLEAN DEFAULT false;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS outdoor_seating BOOLEAN DEFAULT false;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS wheelchair_accessible BOOLEAN DEFAULT false;

-- Menu information
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS menu_url TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS menu_items JSONB;
-- Example structure:
-- [
--   {"name": "Flat White", "description": "Double ristretto with silky microfoam", "price": 4.50, "category": "Espresso"},
--   {"name": "Pour Over", "description": "Single origin filter coffee", "price": 5.00, "category": "Filter"}
-- ]

-- Pricing (different from mobile carts' hourly rate)
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$'));
-- $ = Budget friendly (under $5)
-- $$ = Moderate ($5-$8)
-- $$$ = Premium ($8-$12)
-- $$$$ = Luxury (over $12)

-- Reviews and ratings
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) CHECK (average_rating >= 0 AND average_rating <= 5);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0 CHECK (review_count >= 0);

-- Social media and additional contact
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS instagram_handle TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS facebook_url TEXT;

-- ============================================================
-- PHASE 3: Add constraints
-- ============================================================

-- Coffee shops MUST have a physical address
ALTER TABLE vendors ADD CONSTRAINT coffee_shop_address_check
  CHECK (vendor_type != 'coffee_shop' OR physical_address IS NOT NULL);

-- Coffee shops SHOULD have opening hours (warning, not enforced)
-- ALTER TABLE vendors ADD CONSTRAINT coffee_shop_hours_check
--   CHECK (vendor_type != 'coffee_shop' OR opening_hours IS NOT NULL);
-- NOTE: Commented out to allow gradual migration

-- Mobile carts should have capacity range
-- (Already have capacity_min/max, no new constraint needed)

-- ============================================================
-- PHASE 4: Create indexes for performance
-- ============================================================

-- Index on vendor_type for filtering
CREATE INDEX IF NOT EXISTS idx_vendors_type ON vendors(vendor_type);

-- Composite index for common queries (type + verified)
CREATE INDEX IF NOT EXISTS idx_vendors_type_verified ON vendors(vendor_type, verified);

-- GIN index for suburbs array (already exists, verify)
CREATE INDEX IF NOT EXISTS idx_vendors_suburbs_gin ON vendors USING GIN(suburbs);

-- Index for rating-based sorting
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON vendors(average_rating DESC NULLS LAST) WHERE average_rating IS NOT NULL;

-- Index for location-based queries (future: nearby coffee shops)
CREATE INDEX IF NOT EXISTS idx_vendors_location ON vendors(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================================
-- PHASE 5: Add comments for documentation
-- ============================================================

COMMENT ON COLUMN vendors.vendor_type IS 'mobile_cart for event-based services, coffee_shop for physical locations';
COMMENT ON COLUMN vendors.physical_address IS 'Full street address for coffee shops (required for coffee_shop type)';
COMMENT ON COLUMN vendors.opening_hours IS 'JSON object with day keys (monday-sunday) and {open, close} time values in HH:MM format';
COMMENT ON COLUMN vendors.menu_items IS 'JSON array of menu items with name, description, price, and category';
COMMENT ON COLUMN vendors.price_range IS '$ to $$$$ indicating price level for coffee/menu items';
COMMENT ON COLUMN vendors.average_rating IS 'Calculated average rating from 1-5 stars';
COMMENT ON COLUMN vendors.review_count IS 'Total number of verified reviews';
COMMENT ON COLUMN vendors.seating_capacity IS 'Maximum number of seated customers';
COMMENT ON COLUMN vendors.latitude IS 'Latitude for map display and proximity searches';
COMMENT ON COLUMN vendors.longitude IS 'Longitude for map display and proximity searches';

-- ============================================================
-- PHASE 6: Seed example coffee shop data (optional)
-- ============================================================

-- Example: Seven Seeds Coffee Roasters (Carlton)
-- Uncomment to insert example data

/*
INSERT INTO vendors (
  vendor_type,
  business_name,
  slug,
  specialty,
  description,
  physical_address,
  latitude,
  longitude,
  suburbs,
  opening_hours,
  seating_capacity,
  wifi_available,
  parking_available,
  outdoor_seating,
  wheelchair_accessible,
  price_range,
  tags,
  contact_email,
  contact_phone,
  website,
  instagram_handle,
  verified
) VALUES (
  'coffee_shop',
  'Seven Seeds Coffee Roasters',
  'seven-seeds-coffee-roasters',
  'Specialty coffee roasting & cafe',
  'Melbourne''s pioneering specialty coffee roaster with a focus on direct trade, sustainability, and exceptional espresso. Our Carlton cafe features a full brew bar, retail counter, and training space.',
  '114 Berkeley Street, Carlton VIC 3053',
  -37.7994,
  144.9667,
  ARRAY['Carlton', 'Parkville', 'North Melbourne'],
  '{
    "monday": {"open": "07:00", "close": "16:00"},
    "tuesday": {"open": "07:00", "close": "16:00"},
    "wednesday": {"open": "07:00", "close": "16:00"},
    "thursday": {"open": "07:00", "close": "16:00"},
    "friday": {"open": "07:00", "close": "16:00"},
    "saturday": {"open": "08:00", "close": "17:00"},
    "sunday": {"open": "08:00", "close": "17:00"}
  }'::jsonb,
  40,
  true,
  false,
  true,
  true,
  '$$',
  ARRAY['specialty-coffee', 'espresso', 'pour-over', 'single-origin', 'roastery'],
  'carlton@sevenseeds.com.au',
  '(03) 9347 8664',
  'https://sevenseeds.com.au',
  'sevenseeds',
  true
);
*/

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check that migration applied successfully
-- Run these after migration:

-- 1. Verify vendor_type column exists and has correct values
-- SELECT vendor_type, COUNT(*) FROM vendors GROUP BY vendor_type;

-- 2. Verify constraints are in place
-- SELECT conname, contype FROM pg_constraint WHERE conrelid = 'vendors'::regclass;

-- 3. Verify indexes created
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'vendors';

-- 4. Check all existing vendors are marked as mobile_cart
-- SELECT COUNT(*) FROM vendors WHERE vendor_type = 'mobile_cart';

-- 5. Verify coffee shop fields allow NULL for mobile carts
-- SELECT business_name, vendor_type, physical_address FROM vendors WHERE vendor_type = 'mobile_cart' LIMIT 5;

-- ============================================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================================

/*
-- WARNING: This will remove all coffee shop data!
-- Only run if you need to completely undo this migration

-- Drop indexes
DROP INDEX IF EXISTS idx_vendors_type;
DROP INDEX IF EXISTS idx_vendors_type_verified;
DROP INDEX IF EXISTS idx_vendors_rating;
DROP INDEX IF EXISTS idx_vendors_location;

-- Drop constraints
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendor_type_check;
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS coffee_shop_address_check;

-- Remove columns (data will be lost!)
ALTER TABLE vendors DROP COLUMN IF EXISTS vendor_type;
ALTER TABLE vendors DROP COLUMN IF EXISTS physical_address;
ALTER TABLE vendors DROP COLUMN IF EXISTS google_maps_url;
ALTER TABLE vendors DROP COLUMN IF EXISTS latitude;
ALTER TABLE vendors DROP COLUMN IF EXISTS longitude;
ALTER TABLE vendors DROP COLUMN IF EXISTS opening_hours;
ALTER TABLE vendors DROP COLUMN IF EXISTS seating_capacity;
ALTER TABLE vendors DROP COLUMN IF EXISTS wifi_available;
ALTER TABLE vendors DROP COLUMN IF EXISTS parking_available;
ALTER TABLE vendors DROP COLUMN IF EXISTS outdoor_seating;
ALTER TABLE vendors DROP COLUMN IF EXISTS wheelchair_accessible;
ALTER TABLE vendors DROP COLUMN IF EXISTS menu_url;
ALTER TABLE vendors DROP COLUMN IF EXISTS menu_items;
ALTER TABLE vendors DROP COLUMN IF EXISTS price_range;
ALTER TABLE vendors DROP COLUMN IF EXISTS average_rating;
ALTER TABLE vendors DROP COLUMN IF EXISTS review_count;
ALTER TABLE vendors DROP COLUMN IF EXISTS instagram_handle;
ALTER TABLE vendors DROP COLUMN IF EXISTS facebook_url;
*/
