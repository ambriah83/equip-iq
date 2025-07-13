-- Create table for Edge Function rate limiting
CREATE TABLE IF NOT EXISTS edge_function_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for efficient querying
CREATE INDEX idx_rate_limits_key_created ON edge_function_rate_limits(key, created_at DESC);

-- Add a cleanup policy (optional - can be done via cron job instead)
-- This automatically removes entries older than 24 hours
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM edge_function_rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE edge_function_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can access this table
CREATE POLICY "Service role only" ON edge_function_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);