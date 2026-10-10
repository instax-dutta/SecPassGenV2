import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextResponse } from 'next/server'

/**
 * Serves llms.txt as prose from a single source, so the crawler-facing copy
 * cannot drift from the version already published at /llms.txt.
 */
export async function GET() {
  const body = await readFile(join(process.cwd(), 'public', 'llms.txt'), 'utf8')
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
