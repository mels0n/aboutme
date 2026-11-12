// SPDX-License-Identifier: PolyForm-Strict-1.0.0
"use client";

import { useEffect, useRef, useState } from "react";
import { formatScientific } from "../model/entropy";
import { STRENGTH_BANDS, strengthLabel } from "../model/strength";
import { focusRing } from "./controls";
import type { SecretState } from "./use-secret";

/** The site's own cut-offs, spelled out from the same constant the label uses. */
const BAND_SUMMARY = STRENGTH_BANDS.map((band, i) => {
    const next = STRENGTH_BANDS[i + 1];
    if (!next) return `${band.label}: ${band.min} bits or more`;
    return i === 0 ? `${band.label}: under ${next.min} bits` : `${band.label}: ${band.min} to ${next.min - 1}`;
}).join(". ");

const buttonBase = `inline-flex min-h-11 items-center justify-center rounded px-5 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${focusRing}`;

type Props = {
    state: SecretState;
    onRegenerate: () => void;
    /** What the random part of the output is, for the entropy line. */
    entropyNote?: string;
};

export function OutputPanel({ state, onRegenerate, entropyNote }: Props) {
    const outputRef = useRef<HTMLTextAreaElement>(null);
    const [message, setMessage] = useState("");

    // The announcement is cleared a moment later so a second copy announces again.
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => setMessage(""), 3000);
        return () => clearTimeout(timer);
    }, [message]);

    const value = state.status === "ready" ? state.value : "";

    async function copy() {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setMessage("Copied");
        } catch {
            // Clipboard API blocked or unavailable: select the text so Ctrl+C works.
            outputRef.current?.focus();
            outputRef.current?.select();
            setMessage("Press Ctrl+C to copy");
        }
    }

    const rows = Math.min(8, Math.max(2, Math.ceil(value.length / 26)));
    const placeholder = state.status === "pending" ? "Generating..." : "";

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label htmlFor="secret-output" className="block text-sm font-bold text-foreground">
                    Generated value
                </label>
                <textarea
                    id="secret-output"
                    ref={outputRef}
                    readOnly
                    value={value}
                    rows={rows}
                    placeholder={placeholder}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    data-1p-ignore
                    data-lpignore="true"
                    data-bwignore="true"
                    className={`block w-full resize-none rounded border border-border bg-background p-3 font-mono text-xl leading-snug text-foreground [overflow-wrap:anywhere] ${focusRing}`}
                />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={copy}
                    disabled={!value}
                    className={`${buttonBase} bg-foreground text-background hover:opacity-90 disabled:opacity-40`}
                >
                    Copy
                </button>
                <button
                    type="button"
                    onClick={onRegenerate}
                    className={`${buttonBase} border border-border text-foreground hover:bg-surface`}
                >
                    Regenerate
                </button>
                <span role="status" aria-live="polite" className="min-h-5 text-sm font-bold text-highlight">
                    {message}
                </span>
            </div>

            <div aria-live="polite" className="text-sm text-foreground">
                {state.status === "error" && (
                    <p className="rounded border border-highlight/60 bg-surface/60 px-3 py-2">{state.message}</p>
                )}
            </div>

            {state.status === "ready" && (
                <dl className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-3">
                    <Stat label="Entropy" note={entropyNote}>
                        {state.entropy.bits.toFixed(1)} bits
                    </Stat>
                    <Stat label="Possible outputs">
                        <Outputs count={state.entropy.outputs} />
                    </Stat>
                    <Stat label="Strength">{strengthLabel(state.entropy.bits)}</Stat>
                </dl>
            )}

            <p className="text-xs text-foreground/70">
                Strength labels are this site&apos;s own rule of thumb, not a standard. {BAND_SUMMARY}.
            </p>
        </div>
    );
}

function Stat({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
    return (
        <div className="min-w-0">
            <dt className="text-xs font-bold uppercase tracking-wider text-foreground/70">{label}</dt>
            <dd className="text-lg font-bold text-foreground">{children}</dd>
            {note && <p className="text-xs text-foreground/70">{note}</p>}
        </div>
    );
}

function Outputs({ count }: { count: bigint }) {
    const { mantissa, exponent } = formatScientific(count);
    return (
        <span>
            about {mantissa} &times; 10<sup>{exponent}</sup>
        </span>
    );
}
