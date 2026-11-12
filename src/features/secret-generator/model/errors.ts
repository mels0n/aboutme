// SPDX-License-Identifier: PolyForm-Strict-1.0.0
/**
 * Every failure the generator can report. The UI shows `message` as is, so
 * messages are plain sentences for the person at the keyboard.
 */
export type GeneratorErrorCode =
    | "invalid-range"
    | "invalid-options"
    | "empty-wordlist"
    | "invalid-email"
    | "invalid-domain";

export class GeneratorError extends Error {
    readonly code: GeneratorErrorCode;

    constructor(code: GeneratorErrorCode, message: string) {
        super(message);
        this.name = "GeneratorError";
        this.code = code;
    }
}

/** Safe parse of untrusted input with a zod schema; the first issue becomes a GeneratorError. */
export function parseOrThrow<T>(
    schema: { safeParse: (input: unknown) => { success: true; data: T } | { success: false; error: { issues: { message: string }[] } } },
    input: unknown,
    code: GeneratorErrorCode,
): T {
    const result = schema.safeParse(input);
    if (result.success) return result.data;
    throw new GeneratorError(code, result.error.issues[0]?.message ?? "Invalid input.");
}
