// SPDX-License-Identifier: PolyForm-Strict-1.0.0
"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { DEFAULT_PASSPHRASE_OPTIONS, type PassphraseOptions } from "../model/passphrase";
import { DEFAULT_PASSWORD_OPTIONS, type PasswordOptions } from "../model/password";
import { focusRing } from "./controls";
import { PassphrasePanel, PasswordPanel, UsernamePanel, type UsernameState } from "./panels";

type TabKey = "password" | "passphrase" | "username";

const TABS: { key: TabKey; label: string }[] = [
    { key: "password", label: "Password" },
    { key: "passphrase", label: "Passphrase" },
    { key: "username", label: "Username" },
];

const DEFAULT_USERNAME: UsernameState = {
    kind: "word",
    word: { capitalize: false, includeNumber: false },
    email: "",
    domain: "",
};

/**
 * The generator: three tabs (password, passphrase, username) that open on
 * passphrase. Every value is made in this browser after the page loads, so the
 * server-rendered HTML holds no secret. Options live in memory only: nothing
 * is written to storage, the URL, the console or analytics.
 */
export function SecretGenerator() {
    const baseId = useId();
    const [tab, setTab] = useState<TabKey>("passphrase");
    const [password, setPassword] = useState<PasswordOptions>(DEFAULT_PASSWORD_OPTIONS);
    const [passphrase, setPassphrase] = useState<PassphraseOptions>(DEFAULT_PASSPHRASE_OPTIONS);
    const [username, setUsername] = useState<UsernameState>(DEFAULT_USERNAME);
    const [words, setWords] = useState<readonly string[] | null>(null);
    const [wordsFailed, setWordsFailed] = useState(false);
    const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({ password: null, passphrase: null, username: null });

    const needsWords = tab === "passphrase" || (tab === "username" && username.kind === "word");

    // The 7,776-word list is a separate same-origin chunk, fetched when a tab needs it. The default tab
    // needs it, so it loads with the page and generating works offline from then on.
    useEffect(() => {
        if (!needsWords || words || wordsFailed) return;
        let live = true;
        import("../model/eff-large-wordlist")
            .then((m) => live && setWords(m.EFF_LARGE_WORDLIST))
            .catch(() => live && setWordsFailed(true));
        return () => {
            live = false;
        };
    }, [needsWords, words, wordsFailed]);

    function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        const last = TABS.length - 1;
        const target =
            event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
            : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
            : event.key === "Home" ? 0
            : event.key === "End" ? last
            : null;
        if (target === null) return;
        event.preventDefault();
        setTab(TABS[target].key);
        tabRefs.current[TABS[target].key]?.focus();
    }

    const tabId = (key: TabKey) => `${baseId}-tab-${key}`;
    const panelId = (key: TabKey) => `${baseId}-panel-${key}`;

    return (
        <div className="rounded-lg border border-border bg-surface/50">
            <div role="tablist" aria-label="Generator type" className="flex border-b border-border">
                {TABS.map(({ key, label }, index) => {
                    const selected = tab === key;
                    return (
                        <button
                            key={key}
                            ref={(el) => {
                                tabRefs.current[key] = el;
                            }}
                            id={tabId(key)}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            aria-controls={panelId(key)}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => setTab(key)}
                            onKeyDown={(e) => onKeyDown(e, index)}
                            className={`min-h-12 flex-1 border-b-4 px-2 text-sm font-bold uppercase tracking-wider transition-colors sm:px-4 ${focusRing} ${
                                selected
                                    ? "border-highlight text-foreground"
                                    : "border-transparent text-foreground/70 hover:text-foreground"
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <div
                role="tabpanel"
                id={panelId(tab)}
                aria-labelledby={tabId(tab)}
                tabIndex={0}
                className={`p-4 sm:p-6 ${focusRing}`}
            >
                {wordsFailed && needsWords ? (
                    <p className="rounded border border-highlight/60 bg-surface/60 px-3 py-2 text-sm text-foreground">
                        The word list could not be loaded. Reload the page to try again, or use the Password tab.
                    </p>
                ) : tab === "password" ? (
                    <PasswordPanel options={password} onChange={setPassword} />
                ) : tab === "passphrase" ? (
                    <PassphrasePanel options={passphrase} onChange={setPassphrase} words={words} />
                ) : (
                    <UsernamePanel state={username} onChange={setUsername} words={words} />
                )}
            </div>
        </div>
    );
}
