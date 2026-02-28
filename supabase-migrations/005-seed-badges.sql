-- Seed initial verification badges

INSERT INTO badges (badge_type, name, description, icon_url, tier, criteria_llm)
VALUES
  (
    'verification',
    'Verified',
    'Admin-approved vendor',
    '✓',
    1,
    '{"type": "manual", "admin_only": true}'::jsonb
  ),
  (
    'verification',
    'Background Checked',
    'Passed security clearance',
    '✓',
    1,
    '{"type": "manual", "admin_only": true}'::jsonb
  ),
  (
    'verification',
    'Elite Barista',
    'Top 10% rating',
    '✓',
    1,
    '{"type": "achievement", "avg_rating": 4.8}'::jsonb
  ),
  (
    'skill',
    'Latte Art Master',
    'Certified latte art expert',
    '⭐',
    2,
    '{"type": "quiz", "quiz_id": "latte-art-101", "pass_score": 90}'::jsonb
  ),
  (
    'skill',
    'Espresso Expert',
    'Certified espresso specialist',
    '⭐',
    2,
    '{"type": "quiz", "quiz_id": "espresso-fundamentals", "pass_score": 85}'::jsonb
  ),
  (
    'achievement',
    '50 Jobs Completed',
    'Completed 50+ bookings',
    '🏆',
    3,
    '{"type": "achievement", "jobs_completed": 50}'::jsonb
  ),
  (
    'achievement',
    '5-Star Champion',
    'Maintained 5.0 rating for 10+ jobs',
    '🏆',
    3,
    '{"type": "achievement", "perfect_rating_streak": 10}'::jsonb
  )
ON CONFLICT (name) DO NOTHING;
