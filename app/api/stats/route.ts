import { NextResponse } from 'next/server';
import { getGenerationStats } from '@/lib/db';

export async function GET() {
    try {
        const stats = await getGenerationStats();

        return NextResponse.json({
            totalGenerated: stats.total,
            lastUpdated: stats.lastUpdated.toISOString(),
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
