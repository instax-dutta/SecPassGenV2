import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + process.env.IP_SALT || 'default-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function isPasswordUnique(passwordHash: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT COUNT(*)::int as count 
      FROM public.generated_passwords 
      WHERE password_hash = ${passwordHash}
    `;
    return Number(result[0].count) === 0;
  } catch (error) {
    console.error('Error checking password uniqueness:', error);
    throw error;
  }
}

export async function savePassword(
  passwordHash: string,
  length: number,
  charsetConfig: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  },
  ipHash?: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO public.generated_passwords (password_hash, length, charset_config, ip_hash)
      VALUES (${passwordHash}, ${length}, ${JSON.stringify(charsetConfig)}, ${ipHash || null})
    `;
  } catch (error) {
    console.error('Error saving password:', error);
    throw error;
  }
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

export async function getRecentPasswords(limit: number = 10): Promise<Array<{
  id: string;
  length: number;
  charsetConfig: any;
  createdAt: Date;
}>> {
  try {
    const result = await sql`
      SELECT id, length, charset_config, created_at
      FROM public.generated_passwords
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return result.map(row => ({
      id: row.id,
      length: row.length,
      charsetConfig: row.charset_config,
      createdAt: new Date(row.created_at)
    }));
  } catch (error) {
    console.error('Error fetching recent passwords:', error);
    return [];
  }
}
