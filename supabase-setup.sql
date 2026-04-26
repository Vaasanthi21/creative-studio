-- Run this SQL in your Supabase SQL Editor to set up the content_history table
-- Go to: https://app.supabase.com/project/enftsuaywxyeawkdgnut/sql

CREATE TABLE IF NOT EXISTS content_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  persona TEXT NOT NULL,
  persona_label TEXT NOT NULL,
  content_type TEXT NOT NULL,
  tone INTEGER,
  length INTEGER,
  keywords TEXT,
  variants JSONB NOT NULL,
  status TEXT DEFAULT 'completed',
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_content_history_created_date ON content_history(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_content_history_user_id ON content_history(user_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read/write their own data
CREATE POLICY "Users can view own history" ON content_history
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own history" ON content_history
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own history" ON content_history
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
