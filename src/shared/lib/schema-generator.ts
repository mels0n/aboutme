export interface FAQItem {
    question: string;
    answer: string;
}

export interface BlogPostingMeta {
    title: string;
    description: string;
    authorName: string;
    datePublished: string;
    dateModified: string;
    url: string;
    imageUrl?: string;
}

export function generateFAQSchema(faqItems: FAQItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };
}

export function generateBlogPostingSchema(meta: BlogPostingMeta) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: meta.title,
        description: meta.description,
        author: [
            {
                "@type": "Person",
                name: meta.authorName,
            },
        ],
        datePublished: meta.datePublished,
        dateModified: meta.dateModified,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": meta.url,
        },
        ...(meta.imageUrl && { image: [meta.imageUrl] }),
    };
}
