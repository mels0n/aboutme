// SPDX-License-Identifier: PolyForm-Strict-1.0.0
// Statistics shared by the distribution tests. Not used by the generator itself.

/**
 * Chi-square critical value for `df` degrees of freedom at one-sided p = 1e-6
 * (z = 4.753), by the Wilson-Hilferty approximation. A fair generator crosses
 * it about once in a million runs, so these tests are not flaky; an off-by-one,
 * truncation or gross skew on these sample sizes lands far beyond it. Modulo
 * bias is too small for a chi-square to see at these sizes: the scripted tests
 * in random.test.ts cover it directly.
 */
export function critical(df: number): number {
    const z = 4.753;
    const a = 2 / (9 * df);
    return df * (1 - a + z * Math.sqrt(a)) ** 3;
}

export function chiSquare(observed: number[], expectedEach: number): number {
    return observed.reduce((sum, o) => sum + (o - expectedEach) ** 2 / expectedEach, 0);
}
