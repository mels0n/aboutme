import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Params
    const title = searchParams.get('title') || 'Chris Melson | Operational Architect';
    const summary = searchParams.get('summary') || 'Systems thinking for the C-Suite.';
    const mode = searchParams.get('mode') || 'executive';
    const date = searchParams.get('date') || '';
    const role = searchParams.get('role') || 'Operational Architect';

    // Theme Config
    const themes = {
        executive: {
            bg: '#0f172a', // Slate 900
            accent: '#3b82f6', // Blue 500
            text: '#f8fafc', // Slate 50
            subtext: '#94a3b8', // Slate 400
            border: '#1e293b' // Slate 800
        },
        strategist: {
            bg: '#312e81', // Indigo 900
            accent: '#6366f1', // Indigo 500
            text: '#eef2ff', // Indigo 50
            subtext: '#a5b4fc', // Indigo 300
            border: '#4338ca' // Indigo 700
        },
        engineer: {
            bg: '#064e3b', // Emerald 900
            accent: '#10b981', // Emerald 500
            text: '#ecfdf5', // Emerald 50
            subtext: '#6ee7b7', // Emerald 300
            border: '#065f46' // Emerald 800
        }
    };

    const theme = themes[mode as keyof typeof themes] || themes.executive;

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    backgroundColor: theme.bg,
                    padding: '80px',
                    fontFamily: 'sans-serif',
                    position: 'relative'
                }}
            >
                {/* Background Grid Pattern (Simulated) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    opacity: 0.2
                }} />

                {/* Main Content (Title / Name) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 10 }}>
                    <div style={{
                        fontSize: 80,
                        fontWeight: 900,
                        color: theme.text,
                        lineHeight: 1.1,
                        textWrap: 'balance' as any
                    }}>
                        {title}
                    </div>
                </div>

                {/* Meta (Role / Date) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: 32, color: theme.subtext, textTransform: 'uppercase', letterSpacing: '2px' }}>
                    <span style={{ color: theme.accent, fontWeight: 700 }}>{role}</span>
                    {date && <span>•</span>}
                    {date && <span>{date}</span>}
                </div>

                {/* Spacer to push Footer down */}
                <div style={{ flex: 1 }} />

                {/* Footer / Summary */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    paddingTop: '40px',
                    borderTop: `2px solid ${theme.border}`,
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: 32,
                        color: theme.subtext,
                        lineHeight: 1.4,
                        maxWidth: '90%'
                    }}>
                        {summary}
                    </div>
                    <div style={{
                        marginTop: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: 20,
                        color: theme.accent,
                        fontWeight: 600
                    }}>
                        CHRIS.MELSON.US
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
