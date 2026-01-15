import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Christopher Melson | Polymorphic Portfolio";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

// Image generation implementation
export default async function Image() {
    // Executive Theme Colors from globals.css:
    // --background: #ffffff
    // --foreground: #000000
    // --accent: #1e293b (Navy Slate)
    // --highlight: #b45309 (Amber/Gold)

    return new ImageResponse(
        (
            <div
                style={{
                    background: "#ffffff",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start", // Left align
                    justifyContent: "center",
                    fontFamily: 'serif',
                    padding: '80px', // Matches spacing
                }}
            >
                {/* Decorative Document Border/Frame */}
                <div
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        right: "20px",
                        bottom: "20px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "12px",
                        pointerEvents: "none",
                    }}
                />

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", zIndex: 10 }}>
                    {/* Name */}
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 700,
                            color: "#000000",
                            marginBottom: "10px",
                            lineHeight: 1,
                            fontFamily: 'sans-serif',
                        }}
                    >
                        Christopher Melson
                    </div>

                    {/* Titles */}
                    <div
                        style={{
                            fontSize: 32,
                            color: "#334155", // Slate-700
                            fontWeight: 400,
                            marginBottom: "10px",
                            fontFamily: 'serif',
                        }}
                    >
                        Executive | Operational Architect | Board Advisor
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: 24,
                            color: "#64748b", // Slate-500
                            fontStyle: "italic",
                            fontFamily: 'serif',
                        }}
                    >
                        Ensure Strategy Survives Contact with Reality
                    </div>
                </div>

                {/* URL CTA */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 60,
                        left: 80, // Match padding
                        display: "flex",
                        alignItems: "center",
                        fontSize: 24,
                        color: "#0f172a", // Slate-900
                        fontWeight: 700,
                        fontFamily: 'sans-serif',
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                    }}
                >
                    chris.melson.us
                </div>

                {/* Right CTA Button */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 60,
                        right: 80, // Match padding
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 24px",
                        background: "#0f172a", // Slate-900
                        color: "#ffffff",
                        borderRadius: "100px",
                        fontSize: 20,
                        fontWeight: 600,
                        fontFamily: 'sans-serif',
                        letterSpacing: "0.02em",
                    }}
                >
                    De-Risk Your Strategy &rarr;
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
