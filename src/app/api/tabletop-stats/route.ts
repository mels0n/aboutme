import { NextResponse } from 'next/server';

/**
 * Proxy API Handler for TabletopTime community stats.
 *
 * The site CSP only allows same-origin `connect-src`, so the Lab card reads
 * the public tabletoptime.us counts through this route. Upstream refreshes
 * hourly, so the fetch is cached for the same window.
 *
 * @returns {Promise<NextResponse>} Formatted counts keyed for the card's `liveStats` mapping, or an error object.
 */
export const dynamic = 'force-dynamic';

const KEYS = ['eventsActive', 'votingOpen', 'playersActive', 'gamesLockedIn'] as const;

export async function GET() {
    try {
        const res = await fetch('https://tabletoptime.us/api/stats', {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            throw new Error(`External API responded with ${res.status}`);
        }

        const data: Record<string, unknown> = await res.json();
        const formatted: Record<string, string> = {};
        for (const key of KEYS) {
            const value = data[key];
            if (typeof value === 'number' && Number.isFinite(value)) {
                formatted[key] = value.toLocaleString('en-US');
            }
        }

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 502 });
    }
}
