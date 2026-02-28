-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- ============================================================================
-- WORK HISTORY POLICIES
-- ============================================================================

ALTER TABLE work_history ENABLE ROW LEVEL SECURITY;

-- Anyone can add work history (baristas claiming employment)
CREATE POLICY "Anyone can insert work history" ON work_history
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Vendors can see their own work history + approved records
CREATE POLICY "Vendors see own and approved work history" ON work_history
  FOR SELECT
  TO anon
  USING (
    status = 'approved'
    OR barista_id::text = current_setting('request.jwt.claim.sub', true)
    OR shop_id::text = current_setting('request.jwt.claim.sub', true)
  );

-- Vendors can update their own pending work history
CREATE POLICY "Vendors update own pending work history" ON work_history
  FOR UPDATE
  TO anon
  USING (
    barista_id::text = current_setting('request.jwt.claim.sub', true)
    AND status = 'pending'
  );

-- Vendors can delete their own pending work history
CREATE POLICY "Vendors delete own pending work history" ON work_history
  FOR DELETE
  TO anon
  USING (
    barista_id::text = current_setting('request.jwt.claim.sub', true)
    AND status = 'pending'
  );

-- ============================================================================
-- VENDOR BADGES POLICIES
-- ============================================================================

ALTER TABLE vendor_badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view badges
CREATE POLICY "Anyone can view vendor badges" ON vendor_badges
  FOR SELECT
  TO anon
  USING (true);

-- Only service role can insert/update/delete badges
-- (Admin manually assigns via Supabase dashboard or API with service role key)

-- ============================================================================
-- PROFILE SECTIONS POLICIES
-- ============================================================================

ALTER TABLE profile_sections ENABLE ROW LEVEL SECURITY;

-- Vendors can view their own sections
CREATE POLICY "Vendors see own profile sections" ON profile_sections
  FOR SELECT
  TO anon
  USING (
    vendor_id::text = current_setting('request.jwt.claim.sub', true)
  );

-- Vendors can insert their own sections
CREATE POLICY "Vendors insert own profile sections" ON profile_sections
  FOR INSERT
  TO anon
  WITH CHECK (
    vendor_id::text = current_setting('request.jwt.claim.sub', true)
  );

-- Vendors can update their own sections
CREATE POLICY "Vendors update own profile sections" ON profile_sections
  FOR UPDATE
  TO anon
  USING (
    vendor_id::text = current_setting('request.jwt.claim.sub', true)
  );

-- ============================================================================
-- BADGES POLICIES (READ-ONLY FOR ANON)
-- ============================================================================

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view badge definitions
CREATE POLICY "Anyone can view badges" ON badges
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- VENDOR SESSIONS POLICIES (SERVICE ROLE ONLY)
-- ============================================================================

ALTER TABLE vendor_sessions ENABLE ROW LEVEL SECURITY;

-- No public access - all operations via API routes with service role
-- No policies needed (default deny all)

-- ============================================================================
-- QUIZZES POLICIES (READ-ONLY FOR ANON - Phase 2)
-- ============================================================================

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Anyone can view quizzes
CREATE POLICY "Anyone can view quizzes" ON quizzes
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- QUIZ ATTEMPTS POLICIES (Phase 2)
-- ============================================================================

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Vendors can view their own attempts
CREATE POLICY "Vendors see own quiz attempts" ON quiz_attempts
  FOR SELECT
  TO anon
  USING (
    vendor_id::text = current_setting('request.jwt.claim.sub', true)
  );

-- Vendors can insert their own attempts
CREATE POLICY "Vendors insert own quiz attempts" ON quiz_attempts
  FOR INSERT
  TO anon
  WITH CHECK (
    vendor_id::text = current_setting('request.jwt.claim.sub', true)
  );
