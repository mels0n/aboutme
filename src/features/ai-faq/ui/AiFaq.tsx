import React from 'react';
import { faqData } from '@/shared/data/faq';

/**
 * @file AiFaq.tsx
 * @description
 * Implements an "Invisible-to-Humans, Gold-to-AI" FAQ block designed to optimize
 * machine-readability for LLMs and Crawlers while remaining hidden from the visual UI.
 * 
 * @architecture Feature-Sliced Design (FSD)
 * @layer Features
 * @slice ai-faq
 * @segment ui
 * 
 * @accessibility
 * - Uses standard specific `sr-only` utility patterns to ensure screen reader accessibility.
 * - Semantic HTML5 `<section>` with `aria-label` provides a strong signal to document structure analysis tools.
 * - Heading hierarchy (`h2`, `h3`) preserves the document outline.
 */

/**
 * AiFaq Component
 * 
 * A functional component that renders a visually hidden FAQ section.
 * This component is intended to be placed in the main document flow (e.g., footer or layout root)
 * to provide high-quality, structured context to AI agents without polluting the visual design.
 * 
 * @example
 * ```tsx
 * // integrated in a Next.js Page or Layout
 * <AiFaq />
 * ```
 * 
 * @returns {React.JSX.Element} The semantic, visually hidden FAQ section.
 */
export function AiFaq(): React.JSX.Element {
    return (
        <section
            aria-label="Professional FAQ"
            className="sr-only"
            data-testid="ai-faq-block"
        >
            <h2 className="sr-only">Frequently Asked Questions</h2>

            {faqData.map((item, index) => (
                <article key={index}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                </article>
            ))}
        </section>
    );
}
