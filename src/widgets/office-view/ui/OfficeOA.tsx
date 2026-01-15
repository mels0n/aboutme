"use client";

import { HelpCircle } from "lucide-react";
import { FloatingMenuButton } from "./FloatingMenuButton";

interface OfficeOAProps {
    mode?: 'executive' | 'strategist' | 'engineer';
    onWhatIsIt: () => void;
    onDoINeedOne: () => void;
}

export const OfficeOA = ({ mode = 'executive', onWhatIsIt, onDoINeedOne }: OfficeOAProps) => {

    const items = [
        {
            label: "What is it?",
            onClick: onWhatIsIt,
        },
        {
            label: "Do I need one?",
            onClick: onDoINeedOne,
        }
    ];

    return (
        <FloatingMenuButton
            label={<span className="text-[10px] uppercase tracking-wider leading-none block">Operational<br /> Architect?</span>}
            items={items}
            mode={mode}
            positionClassName="bottom-20 right-6 md:bottom-20 md:right-6" // Mobile: bottom-20 right-6 (above bottom-6 About Me)
            desktopTrigger="hover"
            mobileTrigger="tap"
            className="px-4 py-2" // Standardized padding
            icon={HelpCircle}
            iconPosition="left"
        />
    );
};
