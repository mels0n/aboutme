import { Metadata } from 'next';
import { BlogPost, officeBlogPosts } from '@/shared/data/office_blog_posts';
import Link from 'next/link';

// Find the specific blog post
const post = officeBlogPosts.find(p => p.slug === 'scalability-is-an-engineering-problem');

export const metadata: Metadata = {
    title: post?.title || 'Scalability is an Engineering Problem',
    description: post?.polymorphicSummary?.executive || post?.summary,
};

export default function BlogPostPage() {
    if (!post) {
        return <div>Post not found</div>;
    }

    // JSON-LD Schema for BlogPosting
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.date,
        author: {
            '@type': 'Person',
            name: post.author,
            jobTitle: post.role
        },
        description: post.summary,
        articleBody: post.content
    };

    return (
        <main className="max-w-4xl mx-auto px-6 py-24 font-serif">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm font-mono text-gray-500 uppercase tracking-widest">
                <Link href="/" className="hover:underline hover:text-blue-600">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-bold">Guide</span>
                <span className="mx-2">/</span>
                Operational Architecture
                <span className="mx-2">/</span>
                Blog
            </nav>

            {/* JSON-LD Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Header */}
            <header className="mb-12 border-b pb-8">
                <div className="flex items-center gap-4 text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="text-blue-600 font-bold">{post.role}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight text-gray-900 mb-6">
                    {post.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed font-sans max-w-2xl">
                    {post.polymorphicSummary?.executive}
                </p>
            </header>

            {/* Content */}
            <article className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-blue-600">
                {post.content.split('\n').map((line, i) => {
                    if (line.startsWith('### ')) {
                        return <h3 key={i} className="mt-12 mb-6 text-2xl font-bold text-gray-900">{line.substring(4)}</h3>;
                    }
                    if (line.startsWith('#### ')) {
                        return <h4 key={i} className="mt-8 mb-4 text-xl font-bold text-gray-800">{line.substring(5)}</h4>;
                    }
                    if (line.startsWith('* ')) {
                        return (
                            <div key={i} className="flex gap-3 mb-4 pl-4 border-l-4 border-blue-100 bg-blue-50/30 py-2 rounded-r-lg">
                                <span className="font-bold text-blue-500">•</span>
                                <div className="text-gray-800">
                                    <span dangerouslySetInnerHTML={{ __html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                </div>
                            </div>
                        );
                    }
                    // Numbered Lists
                    if (/^\d+\.\s/.test(line)) {
                        return (
                            <div key={i} className="flex gap-3 mb-3 pl-4">
                                <span className="font-mono font-bold text-gray-500">
                                    {line.split('.')[0]}.
                                </span>
                                <span className="text-gray-900">
                                    <span dangerouslySetInnerHTML={{ __html: line.substring(line.indexOf(' ') + 1).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                </span>
                            </div>
                        );
                    }
                    if (line.trim() === '---') {
                        return <hr key={i} className="my-12 border-gray-200" />;
                    }
                    if (line.trim() === 'Works Cited & Notes') {
                        return <h4 key={i} className="mt-12 mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">{line}</h4>;
                    }
                    if (/^\[\d+\]/.test(line)) {
                        return <p key={i} className="mb-2 text-sm text-gray-500 font-mono">{line}</p>;
                    }
                    if (line.trim() === '') return null;

                    return (
                        <p key={i} className="mb-6 text-gray-700 leading-relaxed">
                            <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </p>
                    );
                })}
            </article>

            {/* Footer Navigation */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center text-sm font-mono uppercase tracking-widest">
                <Link href="/" className="text-blue-600 hover:underline">← Return to Office</Link>
                <span className="text-gray-400">System Reference: OA-2026-BLOG</span>
            </div>
        </main>
    );
}
