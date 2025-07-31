'use client';

import React, { useState, useEffect } from 'react';
import { ScrapedContent } from '@/lib/content-scraper';
import PlaceholderImage from './PlaceholderImage';

export default function AutomatedContentFeed() {
  const [content, setContent] = useState<ScrapedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchContent();
  }, [selectedCategory]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.append('action', 'category');
        params.append('category', selectedCategory);
      } else {
        params.append('action', 'premium');
      }

      const response = await fetch(`/api/automated-content?${params.toString()}`);
      const data = await response.json();
      
      setContent(data.articles || []);
    } catch (error) {
      console.error('Error fetching automated content:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: '', name: 'Premium Content', icon: '💎' },
    { id: 'trinity-college', name: 'Trinity College', icon: '🏛️' },
    { id: 'ucd', name: 'UCD', icon: '🎓' },
    { id: 'policy', name: 'Education Policy', icon: '📋' },
    { id: 'universities', name: 'Universities', icon: '🏫' },
    { id: 'government', name: 'Government', icon: '🏛️' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white mb-2">
          🤖 Conteúdo Automatizado
        </h2>
        <p className="text-emerald-100">
          Agregação inteligente de notícias educacionais irlandesas
        </p>
      </div>

      {/* Category Filter */}
      <div className="px-6 py-4 border-b">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-emerald-100'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Feed */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Nenhum conteúdo encontrado</p>
            <p className="text-gray-400 mt-2">Tente selecionar uma categoria diferente</p>
          </div>
        ) : (
          <div className="space-y-6">
            {content.slice(0, 10).map((article, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={article.image ? 'hidden' : ''}>
                    <PlaceholderImage 
                      width={80} 
                      height={80} 
                      text="EdNews"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs truncate">{article.source}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 2 && (
                        <span className="text-gray-400 text-xs">+{article.tags.length - 2}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${article.relevanceScore * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(article.relevanceScore * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {content.length >= 10 && (
          <div className="text-center mt-6">
            <a
              href="/search"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Ver Mais Conteúdo
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="px-6 py-3 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Conteúdo atualizado automaticamente a cada hora</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
