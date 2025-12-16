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
    // Executive Blue: #2563eb (blue-600)
    // Background: Slate-950 (#020617) for high contrast/premium feel

    return new ImageResponse(
        (
            <div
                style={{
                    background: "#020617", // Slate-950
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: '"Inter", sans-serif',
                }}
            >
                {/* Subtle Background Mesh/Grid Effect */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                        opacity: 0.3,
                    }}
                />

                {/* Main Content Container */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>

                    {/* Executive Badge */}
                    <div
                        style={{
                            display: "flex",
                            padding: "8px 24px",
                            borderRadius: "9999px",
                            border: "1px solid rgba(37, 99, 235, 0.3)", // blue-600 with opacity
                            background: "rgba(37, 99, 235, 0.1)",
                            color: "#60a5fa", // blue-400
                            fontSize: 20,
                            fontWeight: 600,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            marginBottom: "40px",
                        }}
                    >
                        Executive Summary
                    </div>

                    {/* Name */}
                    <div
                        style={{
                            fontSize: 84,
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            color: "white",
                            marginBottom: "10px",
                            lineHeight: 1,
                            textAlign: "center",
                        }}
                    >
                        CHRIS MELSON
                    </div>

                    {/* Divider Line */}
                    <div
                        style={{
                            width: "80px",
                            height: "6px",
                            background: "#2563eb", // blue-600
                            borderRadius: "3px",
                            marginTop: "20px",
                            marginBottom: "30px",
                        }}
                    />

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: 36,
                            color: "#94a3b8", // slate-400
                            fontWeight: 500,
                            letterSpacing: "-0.01em",
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
                        fontSize: 24,
                        color: "#475569", // slate-600
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                    }}
                >
                    CHRIS.MELSON.US
                </div>
            </div>
        ),
        {
            ...size,
            // We can import fonts here if needed, but system sans-serif works well for "Executive" clean look
        }
    );
}
