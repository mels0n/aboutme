import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') ?? 'Operational Architecture';
    const date = searchParams.get('date') ?? '';

    let formattedDate = '';
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [y, m, d] = date.split('-').map(Number);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        formattedDate = `${months[m - 1]} ${d}, ${y}`;
    }

    const fontSize = title.length > 65 ? 44 : title.length > 45 ? 52 : 60;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    background: 'linear-gradient(140deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Amber left accent bar */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '6px',
                        height: '630px',
                        background: 'linear-gradient(180deg, #d97706 0%, #b45309 50%, #d97706 100%)',
                    }}
                />

                {/* Subtle top-right glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-120px',
                        right: '-120px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(180,83,9,0.12) 0%, transparent 70%)',
                    }}
                />

                {/* Content column */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '52px 72px 48px 84px',
                        width: '1200px',
                        height: '630px',
                    }}
                >
                    {/* Top label row */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '44px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                letterSpacing: '3px',
                                color: '#b45309',
                                fontFamily: 'system-ui, sans-serif',
                                textTransform: 'uppercase',
                            }}
                        >
                            Operational Architecture
                        </div>
                        <div
                            style={{
                                width: '4px',
                                height: '4px',
                                borderRadius: '2px',
                                background: '#334155',
                            }}
                        />
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                letterSpacing: '2px',
                                color: '#475569',
                                fontFamily: 'system-ui, sans-serif',
                                textTransform: 'uppercase',
                            }}
                        >
                            chris.melson.us
                        </div>
                    </div>

                    {/* Title — fills vertical space */}
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                fontSize: `${fontSize}px`,
                                fontWeight: 700,
                                color: '#f8fafc',
                                lineHeight: 1.18,
                                maxWidth: '980px',
                                fontFamily: 'Georgia, "Times New Roman", serif',
                            }}
                        >
                            {title}
                        </div>
                    </div>

                    {/* Divider */}
                    <div
                        style={{
                            width: '52px',
                            height: '2px',
                            background: '#b45309',
                            marginBottom: '24px',
                        }}
                    />

                    {/* Bottom row: author + date */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#f1f5f9',
                                    fontFamily: 'system-ui, sans-serif',
                                }}
                            >
                                Christopher Melson
                            </div>
                            <div
                                style={{
                                    fontSize: '14px',
                                    color: '#94a3b8',
                                    letterSpacing: '0.3px',
                                    fontFamily: 'system-ui, sans-serif',
                                }}
                            >
                                Transformation Executive · Operational Architect
                            </div>
                        </div>

                        {formattedDate && (
                            <div
                                style={{
                                    fontSize: '14px',
                                    color: '#475569',
                                    fontFamily: 'system-ui, sans-serif',
                                }}
                            >
                                {formattedDate}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
