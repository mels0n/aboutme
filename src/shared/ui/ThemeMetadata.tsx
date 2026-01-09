"use client";

import { useEffect, useState } from "react";
import { usePersonaStore } from "@/shared/lib/store";

export const ThemeMetadata = () => {
    const { mode, viewMode } = usePersonaStore();
    const [announcement, setAnnouncement] = useState("");

    useEffect(() => {
        // Update Theme Color Meta Tag
        let color = "#ffffff";
        if (viewMode === 'LAB') {
            color = mode === "executive"
                ? "#ffffff"
                : mode === "strategist"
                    ? "#f5f2eb"
                    : "#000000";
        } else {
            // Office is strictly clean/white
            color = "#ffffff";
        }

        if (document) {
            const themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (themeColorMeta) {
                themeColorMeta.setAttribute("content", color);
            } else {
                const meta = document.createElement("meta");
                meta.name = "theme-color";
                meta.content = color;
                document.head.appendChild(meta);
            }
        }

        // Set Accessibility Announcement
        let message = "";

        if (viewMode === 'OFFICE') {
            message = "Transitioning to The Office. This view represents the professional portfolio of Christopher Melson, focusing on operational architecture and case studies.";
        } else {
            switch (mode) {
                case "executive":
                    message =
                        "Transitioning to the Executive Persona. This view represents the leadership aspect of Christopher Melson. The interface is designed to look and feel like an executive report, with a clean, high-contrast boardroom aesthetic that offers a clear, vision-focused presentation of the core data.";
                    break;
                case "strategist":
                    message =
                        "Transitioning to the Strategist Persona. This view represents the tactical and planning aspect of Christopher Melson. The interface is designed to read like an RPG character sheet, featuring artifacts reminiscent of Magic: The Gathering and a textured, parchment-style game table aesthetic.";
                    break;
                case "engineer":
                    message =
                        "Transitioning to the Engineer Persona. This view represents the technical and builder aspect of Christopher Melson. The interface is designed to feel like a Linux CLI or coding environment, featuring a dark mode terminal with raw data streams that reveal the underlying code and metrics.";
                    break;
            }
        }
        setAnnouncement(message);
    }, [mode, viewMode]);

    return (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
            {announcement}
        </div>
    );
};
