import type { ReactNode } from "react";

const TEMPLATE_PATTERN = /{{(.*?)}}/g;

/**
 * Fills `{{Key}}` placeholders in a description with live values.
 * Placeholders without a value are dropped so raw template syntax never renders.
 *
 * @param text - Description containing `{{Key}}` placeholders.
 * @param values - Map of placeholder key to display value.
 * @param wrap - Optional renderer for a filled value (defaults to the plain string).
 */
export function fillTemplate(
    text: string,
    values: Record<string, string>,
    wrap: (value: string, key: number) => ReactNode = (value) => value
): ReactNode[] {
    // split with a capture group: even indices are static text, odd indices are keys
    return text.split(TEMPLATE_PATTERN).map((part, i) => {
        if (i % 2 === 0) return part;
        const value = values[part.trim()];
        return value ? wrap(value, i) : null;
    });
}

/** Returns the trimmed keys of every `{{Key}}` placeholder in `text`. */
export function templateKeys(text: string): Set<string> {
    return new Set(Array.from(text.matchAll(TEMPLATE_PATTERN), m => m[1].trim()));
}
