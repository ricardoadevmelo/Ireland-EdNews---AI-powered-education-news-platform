'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
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

export default function ArticlePage() {
  const params = useParams();
  const category = params.category as string;
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/content?category=${category}&slug=${slug}`);
        if (!response.ok) {
          throw new Error('Article not found');
        }
        const data = await response.json();
        setArticle(data);
        
        // Serialize MDX content
        const mdxContent = await serialize(data.content);
        setMdxSource(mdxContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (category && slug) {
      fetchArticle();
    }
  }, [category, slug]);

  if (loading) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested article could not be found.'}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const categoryName = article.metadata.category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>•</li>
            <li>
              <Link 
                href={`/category/${article.metadata.category}`}
                className="hover:text-blue-600"
              >
                {categoryName}
              </Link>
            </li>
            <li>•</li>
            <li className="text-gray-900 truncate">{article.metadata.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              {categoryName}
            </span>
            <time className="text-sm text-gray-500">
              {new Date(article.metadata.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.metadata.title}
          </h1>

          {article.metadata.subtitle && (
            <p className="text-xl text-blue-600 mb-6 italic">
              {article.metadata.subtitle}
            </p>
          )}

          {article.metadata.urlToImage && (
            <div className="aspect-video relative mb-6 rounded-lg overflow-hidden">
              <Image
                src={article.metadata.urlToImage}
                alt={article.metadata.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                By <span className="font-medium text-gray-900">{article.metadata.author}</span>
              </span>
              <span className="text-sm text-gray-500">
                Source: <span className="font-medium text-gray-900">{article.metadata.source}</span>
              </span>
            </div>
            
            {article.metadata.tags && article.metadata.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                {article.metadata.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {mdxSource && <MDXRemote {...mdxSource} />}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Read the Original Article
            </h3>
            <p className="text-gray-600 mb-4">
              This is a summary generated by our AI system. For the complete story and full details, 
              please visit the original source.
            </p>
            <Link
              href={article.metadata.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visit {article.metadata.source}
              <svg 
                className="w-4 h-4 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
