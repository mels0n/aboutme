import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://chris.melson.us',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://chris.melson.us/guide/ai-faq',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://chris.melson.us/guide/operational-architecture/case-studies',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://chris.melson.us/guide/operational-architecture/faq',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: 'https://chris.melson.us/guide/operational-architecture/blog/tri-modal-brand-translation',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://chris.melson.us/guide/operational-architecture/blog/bridging-the-integration-gap',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://chris.melson.us/guide/operational-architecture/blog/scalability-is-an-engineering-problem',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://chris.melson.us/guide/operational-architecture/blog/orchestrating-the-transition-generative-to-agentic-ai',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];
}
