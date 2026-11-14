// SPDX-License-Identifier: PolyForm-Strict-1.0.0
"use client";

import { useMemo, useId } from "react";
import { emailTagEntropy, passphraseEntropy, passwordEntropy, randomWordEntropy } from "../model/entropy";
import { GeneratorError } from "../model/errors";
import {
    MAX_SEPARATOR_LENGTH, MAX_WORDS, MIN_WORDS, generatePassphrase, type PassphraseOptions,
} from "../model/passphrase";
import {
    MAX_LENGTH, MAX_MINIMUM, MIN_LENGTH, generatePassword, type PasswordOptions,
} from "../model/password";
import {
    generateCatchAllEmail, generatePlusAddressedEmail, generateRandomWordUsername, type RandomWordOptions,
} from "../model/username";
import { CheckboxField, NumberField, RangeField, TextField, focusRing } from "./controls";
import { CrackTimeTable } from "./CrackTimeTable";
import { OutputPanel } from "./OutputPanel";
import { useSecret, type Generated } from "./use-secret";

const grid = "grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2";

/* -------------------------------------------------------------- password */

type PasswordPanelProps = { options: PasswordOptions; onChange: (options: PasswordOptions) => void };

export function PasswordPanel({ options, onChange }: PasswordPanelProps) {
    const produce = useMemo(
        () => (): Generated => ({ value: generatePassword(options), entropy: passwordEntropy(options) }),
        [options],
    );
    const [state, regenerate] = useSecret(produce);
    const set = (patch: Partial<PasswordOptions>) => onChange({ ...options, ...patch });

    return (
        <div className="space-y-6">
            <OutputPanel state={state} onRegenerate={regenerate} entropyNote="Counts every password your settings allow." />
            <div className="space-y-4 border-t border-border pt-4">
                <RangeField label="Length" value={options.length} min={MIN_LENGTH} max={MAX_LENGTH} onChange={(length) => set({ length })} />
                <fieldset className="space-y-1">
                    <legend className="text-sm font-bold text-foreground">Characters</legend>
                    <div className={grid}>
                        <CheckboxField label="Uppercase (A-Z)" checked={options.uppercase} onChange={(uppercase) => set({ uppercase })} />
                        <CheckboxField label="Lowercase (a-z)" checked={options.lowercase} onChange={(lowercase) => set({ lowercase })} />
                        <CheckboxField label="Numbers (0-9)" checked={options.numbers} onChange={(numbers) => set({ numbers })} />
                        <CheckboxField label="Special (!@#$%^&*)" checked={options.special} onChange={(special) => set({ special })} />
                    </div>
                </fieldset>
                <div className={grid}>
                    <NumberField
                        label="Minimum numbers"
                        value={options.minNumbers}
                        min={0}
                        max={MAX_MINIMUM}
                        disabled={!options.numbers}
                        onChange={(minNumbers) => set({ minNumbers })}
                    />
                    <NumberField
                        label="Minimum special"
                        value={options.minSpecial}
                        min={0}
                        max={MAX_MINIMUM}
                        disabled={!options.special}
                        onChange={(minSpecial) => set({ minSpecial })}
                    />
                </div>
                <p className="text-xs text-foreground/70">
                    Every character set you turn on is always used at least once.
                </p>
                <CheckboxField
                    label="Avoid ambiguous characters (I, O, l, 0, 1)"
                    checked={options.avoidAmbiguous}
                    onChange={(avoidAmbiguous) => set({ avoidAmbiguous })}
                />
            </div>
        </div>
    );
}

/* ------------------------------------------------------------ passphrase */

type PassphrasePanelProps = {
    options: PassphraseOptions;
    onChange: (options: PassphraseOptions) => void;
    /** The EFF list, or null until it has loaded. */
    words: readonly string[] | null;
};

export function PassphrasePanel({ options, onChange, words }: PassphrasePanelProps) {
    const produce = useMemo(
        () =>
            words
                ? (): Generated => ({ value: generatePassphrase(options, words), entropy: passphraseEntropy(options) })
                : null,
        [options, words],
    );
    const [state, regenerate] = useSecret(produce);
    const set = (patch: Partial<PassphraseOptions>) => onChange({ ...options, ...patch });

    return (
        <div className="space-y-6">
            <OutputPanel state={state} onRegenerate={regenerate} entropyNote="Counts every passphrase your settings allow." />
            <div className="space-y-4 border-t border-border pt-4">
                <RangeField label="Number of words" value={options.numWords} min={MIN_WORDS} max={MAX_WORDS} onChange={(numWords) => set({ numWords })} />
                <div className={grid}>
                    <TextField
                        label="Separator"
                        value={options.separator}
                        maxLength={MAX_SEPARATOR_LENGTH}
                        hint={`Up to ${MAX_SEPARATOR_LENGTH} characters. Can be empty.`}
                        onChange={(separator) => set({ separator })}
                    />
                </div>
                <div className={grid}>
                    <CheckboxField label="Capitalize each word" checked={options.capitalize} onChange={(capitalize) => set({ capitalize })} />
                    <CheckboxField label="Include a number" checked={options.includeNumber} onChange={(includeNumber) => set({ includeNumber })} />
                </div>
            </div>
            {state.status === "ready" && <CrackTimeTable entropy={state.entropy} />}
        </div>
    );
}

/* -------------------------------------------------------------- username */

export type UsernameKind = "word" | "plus" | "catchall";

export type UsernameState = {
    kind: UsernameKind;
    word: RandomWordOptions;
    email: string;
    domain: string;
};

const KINDS: { kind: UsernameKind; label: string }[] = [
    { kind: "word", label: "Random word" },
    { kind: "plus", label: "Plus-addressed email" },
    { kind: "catchall", label: "Catch-all email" },
];

type UsernamePanelProps = {
    state: UsernameState;
    onChange: (state: UsernameState) => void;
    words: readonly string[] | null;
};

export function UsernamePanel({ state: options, onChange, words }: UsernamePanelProps) {
    const name = useId();
    const produce = useMemo((): (() => Generated) | null => {
        switch (options.kind) {
            case "word":
                return words
                    ? () => ({
                          value: generateRandomWordUsername(options.word, words),
                          entropy: randomWordEntropy(options.word),
                      })
                    : null;
            case "plus":
                return () => {
                    if (!options.email.trim()) {
                        throw new GeneratorError("invalid-email", "Enter your email address to get a plus-addressed version.");
                    }
                    return { value: generatePlusAddressedEmail(options.email), entropy: emailTagEntropy() };
                };
            case "catchall":
                return () => {
                    if (!options.domain.trim()) {
                        throw new GeneratorError("invalid-domain", "Enter your catch-all domain, such as example.com.");
                    }
                    return { value: generateCatchAllEmail(options.domain), entropy: emailTagEntropy() };
                };
        }
    }, [options, words]);
    const [state, regenerate] = useSecret(produce);
    const set = (patch: Partial<UsernameState>) => onChange({ ...options, ...patch });

    return (
        <div className="space-y-6">
            <OutputPanel
                state={state}
                onRegenerate={regenerate}
                entropyNote={options.kind === "word" ? undefined : "Only the random part counts."}
            />
            <div className="space-y-4 border-t border-border pt-4">
                <fieldset className="space-y-1">
                    <legend className="text-sm font-bold text-foreground">Type</legend>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                        {KINDS.map(({ kind, label }) => {
                            const id = `${name}-${kind}`;
                            return (
                                <div key={kind} className="flex min-h-10 items-center gap-3">
                                    <input
                                        id={id}
                                        type="radio"
                                        name={name}
                                        checked={options.kind === kind}
                                        onChange={() => set({ kind })}
                                        className={`h-5 w-5 shrink-0 accent-highlight ${focusRing}`}
                                    />
                                    <label htmlFor={id} className="text-sm text-foreground">
                                        {label}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </fieldset>

                {options.kind === "word" && (
                    <div className={grid}>
                        <CheckboxField
                            label="Capitalize"
                            checked={options.word.capitalize}
                            onChange={(capitalize) => set({ word: { ...options.word, capitalize } })}
                        />
                        <CheckboxField
                            label="Include a 4-digit number"
                            checked={options.word.includeNumber}
                            onChange={(includeNumber) => set({ word: { ...options.word, includeNumber } })}
                        />
                    </div>
                )}

                {options.kind === "plus" && (
                    <TextField
                        label="Your email address"
                        value={options.email}
                        inputMode="email"
                        placeholder="name@example.com"
                        hint="Adds +, then 8 random letters and digits, before the @. Not sent anywhere."
                        onChange={(email) => set({ email })}
                    />
                )}

                {options.kind === "catchall" && (
                    <TextField
                        label="Your catch-all domain"
                        value={options.domain}
                        placeholder="example.com"
                        hint="Makes 8 random letters and digits, then @ and your domain."
                        onChange={(domain) => set({ domain })}
                    />
                )}
            </div>
        </div>
    );
}
