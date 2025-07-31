"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from 'next/image';
import LoadingIndicator from "./LoadingIndicator";
import ErrorMessage from "./ErrorMessage";

interface Article {
  title: string;
  url: string;
  urlToImage: string | null;
  description: string;
}

export default function NewsList({ initialCategory }: { initialCategory?: string }) {
  const searchParams = useSearchParams();
  const category = initialCategory || searchParams.get("category") || undefined;

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = new URL("/api/news", window.location.origin);
    if (category) url.searchParams.set("category", category);

    fetch(url.toString())
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then((data) => {
        setArticles(Array.isArray(data.articles) ? data.articles : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="container mx-auto py-8">
      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && articles.length === 0 && (
        <p className="text-center text-gray-600 py-8">
          No articles found{category ? ` for "${category}"` : ''}. Please try another category.
        </p>
      )}
      {!loading && !error && articles.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, idx) => (
            <a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border rounded-lg hover:shadow-lg transition"
            >
              <Image
                src={article.urlToImage || '/placeholder.png'}
                alt={article.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover rounded"
                priority={false}
              />
              <h2 className="text-xl font-semibold mt-4">{article.title}</h2>
              <p className="text-sm text-gray-600 mt-2">{article.description}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
