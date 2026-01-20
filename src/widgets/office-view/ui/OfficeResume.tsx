"use client";

import { useState, useEffect } from "react";

import { FileText, Printer, FileJson } from "lucide-react";
import { FloatingMenuButton } from "./FloatingMenuButton";

interface OfficeResumeProps {
    mode?: 'executive' | 'strategist' | 'engineer';
}

export const OfficeResume = ({ mode = 'executive' }: OfficeResumeProps) => {
    const [resumeUrl, setResumeUrl] = useState<string>("/christopher-melson-cv.pdf");

    useEffect(() => {
        setResumeUrl(`/christopher-melson-cv.pdf?v=${Date.now()}`);
    }, []);

    const handlePrint = (e: React.MouseEvent) => {
        e.preventDefault();
        const pdfUrl = "/chris-melson.pdf";

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);

        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
            }, 500);
        };
    };

    const items = [
        {
            label: "View CV",
            subLabel: "Visual",
            icon: FileText,
            href: resumeUrl,
            external: true
        },
        {
            label: "Print CV",
            subLabel: "Letter",
            icon: Printer,
            href: "/chris-melson.pdf",
            onClick: handlePrint
        },
        {
            label: "JSON CV",
            subLabel: "Schema",
            icon: FileJson,
            href: "/cv.json",
            external: true
        }
    ];

    // Hidden on mobile (md:flex) because MobileResumeActions handles mobile view
    return (
        <FloatingMenuButton
            label="Resume"
            items={items}
            mode={mode}
            positionClassName="bottom-6 left-6 hidden md:flex"
            desktopTrigger="hover"
            mobileTrigger="none"
            icon={FileText}
            iconPosition="right"
        />
    );
};
