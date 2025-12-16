import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Chris Melson | Polymorphic Portfolio";
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
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: 'serif',
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
                        border: "2px solid #e2e8f0", // Soft Gray Border
                        borderRadius: "12px",
                        pointerEvents: "none",
                    }}
                />

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>





                    {/* Name */}
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            color: "#000000",
                            marginBottom: "20px",
                            lineHeight: 1,
                            textAlign: "center",
                            fontFamily: 'sans-serif', // Inter replacement for bold header
                        }}
                    >
                        CHRIS MELSON
                    </div>

                    {/* Divider */}
                    <div
                        style={{
                            width: "60px",
                            height: "4px",
                            background: "#000000",
                            marginBottom: "30px",
                        }}
                    />

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: 32,
                            color: "#334155", // Slate-700
                            fontWeight: 400,
                            letterSpacing: "0.02em",
                        }}
                    >
                        Executive. Strategist. Engineer.
                    </div>
                </div>

                {/* Footer URL */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 60,
                        fontSize: 20,
                        color: "#2563eb", // Blue-600 link color
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        fontFamily: 'sans-serif',
                    }}
                >
                    chris.melson.us
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
