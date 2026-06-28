import { MetadataRoute } from 'next';
import { officeBlogPosts } from '@/shared/data/office_blog_posts';
import { officeCaseStudies } from '@/shared/data/office_case_studies';

const BASE_URL = 'https://chris.melson.us';

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: '2026-04-24', changeFrequency: 'monthly', priority: 1.0 },
        { url: `${BASE_URL}/about`, lastModified: '2026-04-23', changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/faq`, lastModified: '2026-04-23', changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/guide/lab`, lastModified: '2026-05-19', changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/guide/office`, lastModified: '2026-05-19', changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/guide/operational-architecture`, lastModified: '2026-01-15', changeFrequency: 'monthly', priority: 1.0 },
        { url: `${BASE_URL}/guide/operational-architecture/case-studies`, lastModified: '2026-01-10', changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE_URL}/guide/operational-architecture/blog`, lastModified: '2026-03-09', changeFrequency: 'weekly', priority: 0.9 },
    ];

    const caseStudyRoutes: MetadataRoute.Sitemap = officeCaseStudies.map(study => ({
        url: `${BASE_URL}/guide/operational-architecture/case-studies/${study.slug}`,
        lastModified: study.date,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    const blogRoutes: MetadataRoute.Sitemap = officeBlogPosts.map(post => ({
        url: `${BASE_URL}/guide/operational-architecture/blog/${post.slug}`,
        lastModified: post.lastUpdated ?? post.date,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [...staticRoutes, ...caseStudyRoutes, ...blogRoutes];
}
