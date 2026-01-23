-- SecPassGen Database Schema
-- Run this in your NeonDB SQL Editor: https://console.neon.tech

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create generated_passwords table
CREATE TABLE IF NOT EXISTS generated_passwords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    password_hash TEXT NOT NULL UNIQUE,
    length INTEGER NOT NULL,
    charset_config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_hash TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_hash ON generated_passwords(password_hash);
CREATE INDEX IF NOT EXISTS idx_created_at ON generated_passwords(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_charset_config ON generated_passwords USING gin(charset_config);

-- Create statistics table for analytics
CREATE TABLE IF NOT EXISTS generation_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_generated BIGINT DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initialize stats
INSERT INTO generation_stats (total_generated) VALUES (0)
ON CONFLICT DO NOTHING;

-- Create function to increment stats
CREATE OR REPLACE FUNCTION increment_generation_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE generation_stats 
    SET total_generated = total_generated + 1,
        last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-increment stats
DROP TRIGGER IF EXISTS update_generation_stats ON generated_passwords;
CREATE TRIGGER update_generation_stats
    AFTER INSERT ON generated_passwords
    FOR EACH ROW
    EXECUTE FUNCTION increment_generation_stats();

-- Add comments
COMMENT ON TABLE generated_passwords IS 'Stores hashes of all generated passwords to ensure uniqueness';
COMMENT ON TABLE generation_stats IS 'Tracks total number of passwords generated';
