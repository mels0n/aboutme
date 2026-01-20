"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface MobileResumeActionsProps {
    mode?: 'executive' | 'strategist' | 'engineer';
}

export const MobileResumeActions = ({ mode: propMode }: MobileResumeActionsProps) => {
    const mode = propMode || 'executive';
    const [resumeUrl, setResumeUrl] = useState<string>("/christopher-melson-cv.pdf");

    useEffect(() => {
        setResumeUrl(`/christopher-melson-cv.pdf?v=${Date.now()}`);
    }, []);

    const theme = {
        executive: {
            button: "text-blue-700 bg-blue-50/90 border-blue-200 hover:bg-blue-100",
            icon: "text-blue-700",
        },
        strategist: {
            button: "text-indigo-900 bg-indigo-50/90 border-indigo-200 hover:bg-indigo-100",
            icon: "text-indigo-900",
        },
        engineer: {
            button: "text-emerald-800 bg-emerald-50/90 border-emerald-200 hover:bg-emerald-100",
            icon: "text-emerald-800",
        }
    }[mode];

    return (
        <motion.a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "fixed z-40 bottom-6 left-6 px-4 py-2 rounded-full border shadow-sm backdrop-blur-sm transition-all duration-300 flex items-center gap-2 md:hidden",
                theme.button
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide font-serif">Download CV</span>
        </motion.a>
    );
};
