import { neon } from '@neondatabase/serverless';
import { hashIP, keyedHash, requireUniquenessSecret, resolveIpPepper } from './hashing.ts';

// Re-exported so callers keep one import site for signing helpers. Imported
// relatively, with an explicit extension, so this module stays loadable by the
// verification scripts under scripts/ as well as by the Next bundler.
export { hashIP, keyedHash, requireUniquenessSecret, resolveIpPepper } from './hashing.ts';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

export interface CharsetConfig {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return keyedHash(password, requireUniquenessSecret());
}

/**
 * Records a password signature and reports whether it was new.
 *
 * One statement, not a probe followed by an insert. The previous
 * isPasswordUnique + savePassword pair could let two concurrent requests both
 * observe "unused" and both be served, and the insert was fired without being
 * awaited so a frozen serverless instance silently dropped rows.
 * ON CONFLICT DO NOTHING makes the write idempotent and RETURNING makes the
 * collision observable from the write itself.
 */
export async function recordPassword(
  passwordHash: string,
  length: number,
  charsetConfig: CharsetConfig,
  ipHash?: string
): Promise<boolean> {
  const rows = await sql`
    INSERT INTO public.generated_passwords (password_hash, length, charset_config, ip_hash)
    VALUES (${passwordHash}, ${length}, ${JSON.stringify(charsetConfig)}, ${ipHash ?? null})
    ON CONFLICT (password_hash) DO NOTHING
    RETURNING id
  `;
  return rows.length > 0;
}

export async function getGenerationStats(): Promise<{ total: number; lastUpdated: Date }> {
  try {
    const result = await sql`
      SELECT total_generated, last_updated
      FROM public.generation_stats
      LIMIT 1
    `;

    if (result.length === 0) {
      // Table exists but no data - initialize it
      try {
        await sql`INSERT INTO public.generation_stats (total_generated) VALUES (0)`;
      } catch (e) {
        // Ignore if already exists
      }
      return { total: 0, lastUpdated: new Date() };
    }

    return {
      total: Number(result[0].total_generated),
      lastUpdated: new Date(result[0].last_updated)
    };
  } catch (error: any) {
    console.error('Error fetching generation stats:', error);
    // If table doesn't exist, return default values instead of crashing
    if (error?.code === '42P01') {
      console.warn('generation_stats table not found - please run schema.sql');
      return { total: 0, lastUpdated: new Date() };
    }
    return { total: 0, lastUpdated: new Date() };
  }
}
