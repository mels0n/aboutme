export const OFFICE_MODES = {
    'strategic-design': 'executive',
    'resilient-operations': 'strategist',
    'technical-execution': 'engineer'
} as const;

export type OfficeSlug = keyof typeof OFFICE_MODES;
