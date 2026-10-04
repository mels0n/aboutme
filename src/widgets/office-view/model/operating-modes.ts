import type { ComponentType } from "react";
import { Users } from "lucide-react";
import { IconExecution, IconStrategy } from "../ui/branding/ThreePillarsIcons";

export type OperatingModeId = 'executive' | 'strategist' | 'engineer';

export interface OperatingMode {
    id: OperatingModeId;
    /** Visitor-facing name of the lens (Boardroom, Architect, Engine Room). */
    label: string;
    /** URL segment under /mode/ for soft navigation. */
    slug: string;
    icon: ComponentType<{ className?: string }>;
    /** Filled pill styling when this mode is the active one. */
    activeClass: string;
    /** Accent text colour for headings/labels tied to this mode. */
    accentText: string;
    /** Accent border colour for underlines tied to this mode. */
    accentBorder: string;
}

/**
 * Shared definition of the three operating modes for the office view's lens
 * switchers (top nav and case study modal), so their labels, icons and colours
 * stay in step. Slugs are still mirrored in shared/config/seo-routes.ts,
 * shared/ui/PersonaToggle.tsx and OfficeBlogModal.tsx; keep those in sync.
 */
export const OPERATING_MODES: readonly OperatingMode[] = [
    {
        id: 'executive',
        label: 'Boardroom',
        slug: 'strategic-design',
        icon: Users,
        activeClass: "text-blue-700 bg-blue-50 border-blue-200",
        accentText: "text-blue-800",
        accentBorder: "border-blue-600",
    },
    {
        id: 'strategist',
        label: 'Architect',
        slug: 'resilient-operations',
        icon: IconStrategy,
        activeClass: "text-indigo-900 bg-indigo-50 border-indigo-200",
        accentText: "text-indigo-700",
        accentBorder: "border-indigo-500",
    },
    {
        id: 'engineer',
        label: 'Engine Room',
        slug: 'technical-execution',
        icon: IconExecution,
        activeClass: "text-emerald-800 bg-emerald-50 border-emerald-200",
        accentText: "text-emerald-700",
        accentBorder: "border-emerald-500",
    },
] as const;

export const getOperatingMode = (id: OperatingModeId): OperatingMode =>
    OPERATING_MODES.find((m) => m.id === id) ?? OPERATING_MODES[0];

/**
 * Soft-navigation URL for a mode: /mode/<slug>, keeping the current query
 * string minus modal-state params (blog) so they don't re-open on a lens switch.
 */
export const getModeUrl = (id: OperatingModeId, search: string): string => {
    const params = new URLSearchParams(search);
    params.delete('blog');
    const path = `/mode/${getOperatingMode(id).slug}`;
    return params.toString() ? `${path}?${params.toString()}` : path;
};
