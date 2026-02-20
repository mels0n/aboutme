import { MetadataRoute } from 'next';

import { officeBlogPosts } from '@/shared/data/office_blog_posts';
import { officeCaseStudies } from '@/shared/data/office_case_studies';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://chris.melson.us';

    // Static Routes
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/cv.json`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/guide/lab`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/guide/operational-architecture/case-studies`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/guide/itil-problem-management`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
    ];

    // Mode Routes (Deep Links)
    const modes = ['strategic-design', 'resilient-operations', 'technical-execution'];
    const modeRoutes = modes.map(mode => ({
        url: `${baseUrl}/mode/${mode}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    // Dynamic Blog Routes
    const blogRoutes = officeBlogPosts.map(post => ({
        url: `${baseUrl}/guide/operational-architecture/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Dynamic Case Study Routes
    const caseStudyRoutes = officeCaseStudies.map(study => ({
        url: `${baseUrl}/guide/operational-architecture/case-studies/${study.slug}`,
        lastModified: new Date(study.date),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    return [
        ...staticRoutes,
        ...modeRoutes,
        ...caseStudyRoutes,
        ...blogRoutes,
    ];
}
