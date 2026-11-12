// SPDX-License-Identifier: PolyForm-Strict-1.0.0
"use client";

import { useEffect, useState } from "react";
import type { Entropy } from "../model/entropy";
import { GeneratorError } from "../model/errors";

export type Generated = { value: string; entropy: Entropy };

export type SecretState =
    | { status: "pending" }
    | { status: "ready"; value: string; entropy: Entropy }
    | { status: "error"; message: string };

/**
 * Runs `produce` after mount and again whenever it changes (it should change
 * only when the options do) or the caller asks for a new value. The value is
 * created in an effect, never during render, so it cannot appear in the
 * server-rendered HTML. A null `produce` means the inputs are not ready yet.
 * Nothing here stores, logs or sends the value.
 */
export function useSecret(produce: (() => Generated) | null): [SecretState, () => void] {
    const [nonce, setNonce] = useState(0);
    const [state, setState] = useState<SecretState>({ status: "pending" });

    useEffect(() => {
        // Generation is deliberately post-mount and impure (it reads the Web Crypto RNG), so it lives in an effect.
        /* eslint-disable react-hooks/set-state-in-effect */
        if (!produce) {
            setState({ status: "pending" });
            return;
        }
        try {
            setState({ status: "ready", ...produce() });
        } catch (error) {
            setState({
                status: "error",
                message: error instanceof GeneratorError ? error.message : "Could not generate a value in this browser.",
            });
        }
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [produce, nonce]);

    return [state, () => setNonce((n) => n + 1)];
}
