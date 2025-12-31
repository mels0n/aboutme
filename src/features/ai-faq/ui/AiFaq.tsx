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
interface AiFaqProps {
    /**
     * If true, renders the FAQ visibly with standard styling.
     * If false (default), renders as `sr-only` for screen readers/AI only.
     */
    visible?: boolean;
}

export function AiFaq({ visible = false }: AiFaqProps) {
    return (
        <section
            aria-label="Professional FAQ"
            className={visible ? "space-y-8 my-8" : "sr-only"}
            data-testid="ai-faq-block"
        >
            <h2 className={visible ? "text-2xl font-bold font-serif mb-6" : "sr-only"}>
                Frequently Asked Questions
            </h2>

            {faqData.map((item, index) => (
                <article key={index} className={visible ? "space-y-2" : undefined}>
                    <h3 className={visible ? "text-lg font-bold text-foreground/90" : undefined}>
                        {item.question}
                    </h3>
                    <p className={visible ? "text-foreground/70 leading-relaxed" : undefined}>
                        {item.answer}
                    </p>
                </article>
            ))}
        </section>
    );
}
