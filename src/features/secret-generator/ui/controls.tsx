"use client";

import { useId, type ReactNode } from "react";

/** Visible keyboard focus that follows the active theme's highlight colour. */
export const focusRing =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight";

const inputBase =
    `w-full min-w-0 rounded border border-border bg-background px-3 py-2 text-base text-foreground disabled:opacity-50 ${focusRing}`;

type FieldShellProps = { id: string; label: string; hint?: string; children: ReactNode };

function FieldShell({ id, label, hint, children }: FieldShellProps) {
    return (
        <div className="space-y-1 min-w-0">
            <label htmlFor={id} className="block text-sm font-bold text-foreground">
                {label}
            </label>
            {children}
            {hint && (
                <p id={`${id}-hint`} className="text-xs text-foreground/70">
                    {hint}
                </p>
            )}
        </div>
    );
}

/** A number that can be cleared while typing: an empty box reports NaN, which the model rejects with a clear message. */
const toNumber = (text: string) => (text.trim() === "" ? Number.NaN : Number(text));
const fromNumber = (n: number) => (Number.isNaN(n) ? "" : String(n));

type NumberFieldProps = {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    hint?: string;
};

export function NumberField({ label, value, min, max, onChange, disabled, hint }: NumberFieldProps) {
    const id = useId();
    return (
        <FieldShell id={id} label={label} hint={hint}>
            <input
                id={id}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                step={1}
                value={fromNumber(value)}
                disabled={disabled}
                aria-describedby={hint ? `${id}-hint` : undefined}
                onChange={(e) => onChange(toNumber(e.target.value))}
                className={inputBase}
            />
        </FieldShell>
    );
}

/** A slider and a number box bound to one value. */
export function RangeField({ label, value, min, max, onChange }: Omit<NumberFieldProps, "disabled" | "hint">) {
    const id = useId();
    const sliderValue = Number.isNaN(value) ? min : Math.min(max, Math.max(min, value));
    return (
        <div className="space-y-1 min-w-0">
            <label htmlFor={`${id}-number`} className="block text-sm font-bold text-foreground">
                {label}
            </label>
            <div className="flex items-center gap-3">
                <input
                    id={`${id}-range`}
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={sliderValue}
                    aria-label={`${label} slider`}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`flex-1 min-w-0 accent-highlight ${focusRing}`}
                />
                <input
                    id={`${id}-number`}
                    type="number"
                    inputMode="numeric"
                    min={min}
                    max={max}
                    step={1}
                    value={fromNumber(value)}
                    onChange={(e) => onChange(toNumber(e.target.value))}
                    className={`${inputBase} !w-20 shrink-0`}
                />
            </div>
        </div>
    );
}

type TextFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    hint?: string;
    placeholder?: string;
    maxLength?: number;
    inputMode?: "text" | "email" | "url";
};

export function TextField({ label, value, onChange, hint, placeholder, maxLength, inputMode = "text" }: TextFieldProps) {
    const id = useId();
    return (
        <FieldShell id={id} label={label} hint={hint}>
            <input
                id={id}
                type="text"
                inputMode={inputMode}
                value={value}
                maxLength={maxLength}
                placeholder={placeholder}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                data-1p-ignore
                data-lpignore="true"
                aria-describedby={hint ? `${id}-hint` : undefined}
                onChange={(e) => onChange(e.target.value)}
                className={`${inputBase} font-mono`}
            />
        </FieldShell>
    );
}

type CheckboxFieldProps = { label: string; checked: boolean; onChange: (checked: boolean) => void };

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
    const id = useId();
    return (
        <div className="flex items-center gap-3 min-h-10">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className={`h-5 w-5 shrink-0 accent-highlight ${focusRing}`}
            />
            <label htmlFor={id} className="text-sm text-foreground">
                {label}
            </label>
        </div>
    );
}
