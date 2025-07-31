"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NewsletterSignup from '@/components/NewsletterSignup';

interface ArticleMetadata {
  title: string;
  subtitle?: string;
  description: string;
  publishedAt: string;
  source: string;
  sourceUrl: string;
  urlToImage?: string;
  category: string;
  tags: string[];
  author: string;
  generated: string;
  slug: string;
}

interface Article {
  metadata: ArticleMetadata;
  content: string;
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/content?limit=9');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ireland EdNews
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your premier source for education and online learning news in Ireland
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">
            No content available yet. Please run the content generation pipeline.
          </p>
          <p className="text-gray-500 mt-2">
            Run: <code className="bg-gray-100 px-2 py-1 rounded">npm run content:generate</code>
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link 
              key={article.metadata.slug}
              href={`/article/${article.metadata.category}/${article.metadata.slug}`}
              className="block group"
            >
              <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {article.metadata.urlToImage && (
                  <div className="aspect-video relative">
                    <Image
                      src={article.metadata.urlToImage}
                      alt={article.metadata.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {article.metadata.category.replace('-', ' ')}
                    </span>
                    <time className="text-xs text-gray-500">
                      {new Date(article.metadata.publishedAt).toLocaleDateString('en-GB')}
                    </time>
                  </div>
                  
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.metadata.title}
                  </h2>
                  
                  {article.metadata.subtitle && (
                    <p className="text-sm text-blue-600 mb-2 italic">
                      {article.metadata.subtitle}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {article.metadata.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      by {article.metadata.author}
                    </span>
                    <span className="text-xs font-medium text-blue-600">
                      Read more →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Newsletter Signup Section */}
      <div className="mt-16">
        <NewsletterSignup />
      </div>
    </main>
  );
}
