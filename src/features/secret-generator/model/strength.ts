// SPDX-License-Identifier: PolyForm-Strict-1.0.0
/**
 * Plain-language labels for an entropy figure. These cut-offs are this site's
 * own rule of thumb, not a published standard, and the UI says so.
 * Each band starts at its `min` bits and runs to the next band.
 */
export const STRENGTH_BANDS = [
    { min: 0, label: "Weak" },
    { min: 40, label: "Fair" },
    { min: 60, label: "Strong" },
    { min: 80, label: "Very strong" },
] as const;

export type StrengthLabel = (typeof STRENGTH_BANDS)[number]["label"];

export function strengthLabel(bits: number): StrengthLabel {
    let label: StrengthLabel = STRENGTH_BANDS[0].label;
    for (const band of STRENGTH_BANDS) if (bits >= band.min) label = band.label;
    return label;
}
