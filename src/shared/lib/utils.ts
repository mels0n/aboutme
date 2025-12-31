import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges and strictly resolves Tailwind CSS class conflicts.
 * 
 * @param inputs - A variadic list of class values (strings, objects, arrays) to be conditionally applied.
 * @returns A single string of coalesced class names with conflicting Tailwind utilities resolved.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
