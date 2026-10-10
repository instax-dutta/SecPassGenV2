-- Fixture holding the table definitions that were removed. Used only as a
-- positive control by scripts/check-no-server-state.mjs. Never applied.
CREATE TABLE IF NOT EXISTS generated_passwords (
    password_hash TEXT NOT NULL UNIQUE
);