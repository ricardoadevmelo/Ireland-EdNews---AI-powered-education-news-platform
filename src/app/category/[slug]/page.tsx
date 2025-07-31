'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(`/api/content?category=${slug}`);
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

    if (slug) {
      fetchArticles();
    }
  }, [slug]);

  const categoryName = slug ? slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') : '';

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

  if (articles.length === 0) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{categoryName}</h1>
          <p className="text-gray-600">No articles found in this category.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryName}
        </h1>
        <p className="text-gray-600">
          {articles.length} article{articles.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

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
                  <time className="text-xs text-gray-500">
                    {new Date(article.metadata.publishedAt).toLocaleDateString('en-GB')}
                  </time>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {article.metadata.source}
                  </span>
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
    </main>
  );
}
