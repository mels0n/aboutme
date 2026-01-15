"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface MenuItem {
    label: string;
    subLabel?: string;
    icon?: any;
    onClick?: (e: React.MouseEvent) => void;
    href?: string;
    external?: boolean;
}

interface FloatingMenuButtonProps {
    label: React.ReactNode;
    items: MenuItem[];
    mode?: 'executive' | 'strategist' | 'engineer';
    positionClassName?: string;
    desktopTrigger?: 'hover' | 'click'; // Default hover
    mobileTrigger?: 'tap' | 'none'; // Default tap
    className?: string; // Additional classes for the button itself
    icon?: any;
    iconPosition?: 'left' | 'right';
}

export const FloatingMenuButton = ({
    label,
    items,
    mode = 'executive',
    positionClassName,
    desktopTrigger = 'hover',
    mobileTrigger = 'tap',
    className,
    icon: Icon,
    iconPosition = 'left'
}: FloatingMenuButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const theme = {
        executive: {
            button: "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100",
            menuItem: "bg-blue-50/90 hover:bg-blue-100/90 border-blue-100 text-blue-900",
            subLabel: "text-blue-600/60",
            iconBg: "bg-blue-100 text-blue-600",
            icon: "text-blue-400/50 group-hover:text-blue-600",
            shadow: "shadow-blue-900/5",
        },
        strategist: {
            button: "text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
            menuItem: "bg-indigo-50/90 hover:bg-indigo-100/90 border-indigo-200 text-indigo-900",
            subLabel: "text-indigo-700/60",
            iconBg: "bg-indigo-100/50 text-indigo-700",
            icon: "text-indigo-400/50 group-hover:text-indigo-600",
            shadow: "shadow-indigo-900/5",
        },
        engineer: {
            button: "text-emerald-800 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
            menuItem: "bg-emerald-50/90 hover:bg-emerald-100/90 border-emerald-200 text-emerald-900",
            subLabel: "text-emerald-700/60",
            iconBg: "bg-emerald-200/50 text-emerald-800",
            icon: "text-emerald-600/50 group-hover:text-emerald-800",
            shadow: "shadow-emerald-900/5",
        }
    }[mode];

    // Interaction Handlers
    const handleMouseEnter = () => {
        if (desktopTrigger === 'hover' && window.matchMedia("(min-width: 768px)").matches) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (desktopTrigger === 'hover' && window.matchMedia("(min-width: 768px)").matches) {
            setIsOpen(false);
        }
    };

    const handleClick = () => {
        // On Mobile, always toggle if trigger is tap
        if (window.matchMedia("(max-width: 767px)").matches && mobileTrigger === 'tap') {
            setIsOpen(!isOpen);
        }
        // On Desktop, toggle if trigger is click
        if (window.matchMedia("(min-width: 768px)").matches && desktopTrigger === 'click') {
            setIsOpen(!isOpen);
        }
    };

    const containerRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close (Mobile mainly)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div
            ref={containerRef}
            className={cn("fixed z-30 flex flex-col items-center", positionClassName)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-3 flex flex-col gap-2 w-max min-w-[180px]"
                    >
                        {items.map((item, idx) => {
                            const ItemWrapper = item.href ? 'a' : 'div';
                            return (
                                <ItemWrapper
                                    key={idx}
                                    href={item.href}
                                    target={item.external ? "_blank" : undefined}
                                    rel={item.external ? "noopener noreferrer" : undefined}
                                    onClick={(e) => {
                                        if (item.onClick) item.onClick(e as any);
                                        // Close on selection usually desirable? 
                                        // For hover menus it closes when mouse leaves anyway.
                                        // For click menus it might be good.
                                    }}
                                    className={cn(
                                        "group flex items-center justify-between p-3 rounded-xl border shadow-sm backdrop-blur-md cursor-pointer transition-all hover:scale-[1.02]",
                                        theme.menuItem,
                                        theme.shadow
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon && (
                                            <div className={cn("p-1.5 rounded-md", theme.iconBg)}>
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                        )}
                                        <div className="flex flex-col text-left">
                                            <span className="text-sm font-bold leading-none">{item.label}</span>
                                            {item.subLabel && (
                                                <span className={cn("text-[10px] font-medium uppercase tracking-wider mt-0.5", theme.subLabel)}>
                                                    {item.subLabel}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Only show arrow if it's a link or action, mainly for external or expansion */}
                                    <ArrowUpRight className={cn("w-4 h-4 ml-3 opacity-0 group-hover:opacity-100 transition-opacity", theme.icon)} />
                                </ItemWrapper>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                layout
                onClick={handleClick}
                className={cn(
                    "px-6 py-3 rounded-full border shadow-lg backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer relative z-40",
                    theme.button,
                    className
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
                <div className="text-sm font-medium tracking-wide font-display text-center leading-tight">
                    {label}
                </div>
                {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
            </motion.button>
        </div>
    );
};
