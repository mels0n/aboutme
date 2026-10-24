import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Christopher Melson | Operational Architect",
        short_name: "Chris Melson",
        start_url: "/",
        display: "browser",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
    };
}
