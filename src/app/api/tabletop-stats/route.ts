import { NextResponse } from 'next/server';

// Runs per request; the upstream fetch below carries its own hourly data-cache
// window, and the response headers let the CDN absorb repeat polls.
export const dynamic = 'force-dynamic';

const KEYS = ['eventsActive', 'votingOpen', 'playersActive', 'gamesLockedIn'] as const;

/**
 * Proxy API Handler for TabletopTime community stats.
 *
 * The site CSP only allows same-origin `connect-src`, so the Lab card reads
 * the public tabletoptime.us counts through this route. Upstream refreshes
 * hourly, so a successful fetch is cached for the same window. Failures are
 * not cached by the data cache, so the error response sets a short CDN TTL to
 * keep polling cards from hitting upstream every minute during an outage.
 *
 * @returns {Promise<NextResponse>} Formatted counts keyed for the card's `liveStats` mapping, or an error object.
 */
export async function GET() {
    try {
        const res = await fetch('https://tabletoptime.us/api/stats', {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(5000),
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

        return NextResponse.json(formatted, {
            headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3000' },
        });
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 502, headers: { 'Cache-Control': 'public, s-maxage=300' } },
        );
    }
}
