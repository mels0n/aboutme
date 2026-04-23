import { MetadataRoute } from 'next';
import { officeBlogPosts } from '@/shared/data/office_blog_posts';
import { officeCaseStudies } from '@/shared/data/office_case_studies';

const BASE_URL = 'https://chris.melson.us';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, changeFrequency: 'monthly', priority: 1.0, lastModified: now },
        { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
        { url: `${BASE_URL}/faq`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
        { url: `${BASE_URL}/guide/lab`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
        {
            url: `${BASE_URL}/guide/office`,
            changeFrequency: 'monthly',
            priority: 0.8,
            lastModified: now,
        },
        {
            url: `${BASE_URL}/guide/operational-architecture`,
            changeFrequency: 'monthly',
            priority: 1.0,
            lastModified: now,
        },
        {
            url: `${BASE_URL}/guide/operational-architecture/case-studies`,
            changeFrequency: 'monthly',
            priority: 1.0,
            lastModified: now,
        },
        {
            url: `${BASE_URL}/guide/operational-architecture/blog`,
            changeFrequency: 'monthly',
            priority: 1.0,
            lastModified: now,
        },
    ];

    const blogRoutes: MetadataRoute.Sitemap = officeBlogPosts.map(post => ({
        url: `${BASE_URL}/guide/operational-architecture/blog/${post.slug}`,
        changeFrequency: 'monthly',
        priority: 0.8,
        lastModified: new Date(post.date),
    }));

    const caseStudyRoutes: MetadataRoute.Sitemap = officeCaseStudies.map(study => ({
        url: `${BASE_URL}/guide/operational-architecture/case-studies/${study.slug}`,
        changeFrequency: 'monthly',
        priority: 0.8,
        lastModified: new Date(study.date),
    }));

    return [...staticRoutes, ...caseStudyRoutes, ...blogRoutes];
}
