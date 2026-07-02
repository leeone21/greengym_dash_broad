-- 재등록 관리 상태 저장
CREATE TABLE IF NOT EXISTS renewal_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_name TEXT NOT NULL,
  program TEXT NOT NULL,
  expire_date DATE NOT NULL,
  last_visit_date DATE,
  total_visits INT DEFAULT 0,
  renewal_probability INT DEFAULT 50,
  contacted_kakao BOOLEAN DEFAULT false,
  contacted_sms BOOLEAN DEFAULT false,
  contacted_call BOOLEAN DEFAULT false,
  contacted_visit BOOLEAN DEFAULT false,
  memo TEXT,
  target_month TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE renewal_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "트레이너만 접근" ON renewal_tracking
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'trainer'
    )
  );
