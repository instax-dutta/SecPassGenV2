// Fixture holding the exact server-state code that was removed. Used only as a
// positive control by scripts/check-no-server-state.mjs. Never imported.
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)
const pepper = process.env.UNIQUENESS_SECRET

export async function record(hash: string) {
  await sql`INSERT INTO generated_passwords (password_hash) VALUES (${hash})`
}