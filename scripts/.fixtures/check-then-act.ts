// Fixture holding the exact check-then-act code being removed from lib/db.ts.
// Used only as a positive control by scripts/check-atomic-insert.mjs.
export async function isPasswordUnique(passwordHash: string): Promise<boolean> {
  const result = await sql`
    SELECT COUNT(*)::int as count
    FROM public.generated_passwords
    WHERE password_hash = ${passwordHash}
  `
  return Number(result[0].count) === 0
}

export async function savePassword(passwordHash: string): Promise<void> {
  await sql`
    INSERT INTO public.generated_passwords (password_hash)
    VALUES (${passwordHash})
    ON CONFLICT (password_hash) DO NOTHING
    RETURNING id
  `
}
