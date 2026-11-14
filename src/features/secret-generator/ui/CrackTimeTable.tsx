// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { RIG_LABEL, STORAGE_METHODS, crackTimeText } from "../model/crack-time";
import type { Entropy } from "../model/entropy";

/** Average time to crack by storage method. For secrets a site would store, not usernames. */
export function CrackTimeTable({ entropy }: { entropy: Entropy }) {
    const head = "px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground/70";
    return (
        <div className="space-y-2 border-t border-border pt-4">
            <div className="rounded border border-border">
                <table className="w-full border-collapse text-left text-sm text-foreground">
                    <caption className="px-2 py-1.5 text-left text-sm font-bold">Average time to crack</caption>
                    <thead>
                        <tr className="border-b border-border bg-surface/60">
                            <th scope="col" className={head}>Method</th>
                            <th scope="col" className={head}>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {STORAGE_METHODS.map((method) => (
                            <tr key={method.id} className="border-b border-border align-top last:border-b-0">
                                <th scope="row" className="px-2 py-1.5 font-bold">
                                    {method.label}
                                    <span className="block text-xs font-normal text-foreground/70">{method.example}</span>
                                </th>
                                <td className="px-2 py-1.5 font-bold">{crackTimeText(entropy, method)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-foreground/70">
                Average case for an offline attack on a stolen database with {RIG_LABEL} graphics
                cards; sites also block online guessing with lockouts and two-factor codes.
            </p>
        </div>
    );
}
