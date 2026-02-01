-- The Bean Route — Supabase Schema
-- Run this in Supabase SQL Editor on a fresh project.

-- Vendors table
CREATE TABLE vendors (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  suburbs TEXT[] NOT NULL DEFAULT '{}',
  price_min INTEGER,
  price_max INTEGER,
  capacity_min INTEGER,
  capacity_max INTEGER,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL REFERENCES vendors(id),
  event_type TEXT,
  event_date TEXT,
  event_duration_hours INTEGER,
  guest_count INTEGER,
  location TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  special_requests TEXT,
  estimated_cost INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can read vendors
CREATE POLICY "vendors_public_read" ON vendors
  FOR SELECT USING (TRUE);

-- Anyone can submit an inquiry
CREATE POLICY "inquiries_public_insert" ON inquiries
  FOR INSERT WITH CHECK (TRUE);

-- Inquiries are read-only via anon (admin reads via service role)
CREATE POLICY "inquiries_no_anon_read" ON inquiries
  FOR SELECT USING (FALSE);
