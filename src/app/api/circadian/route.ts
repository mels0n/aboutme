import { NextResponse } from 'next/server';

/**
 * Force dynamic rendering to ensure we always fetch fresh data from the external source.
 * Prevents Next.js from statically optimizing this route.
 */
export const dynamic = 'force-dynamic';

/**
 * Proxy API Handler for Circadian Light Stats.
 * 
 * Bypasses CORS restrictions by fetching data server-side from `melson.us`
 * and serving it to the client.
 * 
 * @returns {Promise<NextResponse>} JSON response containing light statistics or an error object.
 */
export async function GET() {
    try {
        const res = await fetch('https://cr_lights.melson.us/cr_light_stats.php', {
            headers: {
                'Cache-Control': 'no-cache',
            },
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            throw new Error(`External API responded with ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
