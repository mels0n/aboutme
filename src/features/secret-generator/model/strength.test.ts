// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { describe, expect, it } from "vitest";
import { STRENGTH_BANDS, strengthLabel } from "./strength";

describe("strengthLabel", () => {
    it.each([
        [0, "Weak"],
        [39.99, "Weak"],
        [40, "Fair"],
        [59.9, "Fair"],
        [60, "Strong"],
        [79.99, "Strong"],
        [80, "Very strong"],
        [400, "Very strong"],
    ])("%f bits is %s", (bits, label) => {
        expect(strengthLabel(bits)).toBe(label);
    });

    it("keeps its thresholds in one constant, in ascending order", () => {
        expect(STRENGTH_BANDS.map((b) => b.min)).toEqual([0, 40, 60, 80]);
    });
});
