'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  title: string;
  description: string;
  content: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: string;
  category: string;
  tags: string[];
  relevanceScore: number;
}

interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  query: string;
  filters: {
    categories: { name: string; count: number }[];
    sources: { name: string; count: number }[];
    dateRanges: { name: string; count: number }[];
  };
  facets: {
    categories: string[];
    sources: string[];
  };
  suggestions: string[];
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = async (searchQuery: string = query, pageNum: number = 1) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: pageNum.toString(),
        ...(selectedCategory && { category: selectedCategory })
      });
      
      const response = await fetch(`/api/search?${params}`);
      const data: SearchResponse = await response.json();
      
      setResults(data.results || []);
      setTotalResults(data.totalResults || 0);
      setFilters(data.filters || {});
      setPage(pageNum);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Buscar Notícias
          </h1>
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busque por universidades, vistos, bolsas..."
                className="flex-1 px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Categoria</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas as categorias</option>
                  <option value="universidades">Universidades</option>
                  <option value="vistos">Vistos</option>
                  <option value="bolsas">Bolsas</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="acomodacao">Acomodação</option>
                </select>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Busca Rápida</h4>
                <div className="space-y-2">
                  {['Trinity College', 'UCD', 'Student Visa', 'Working Holiday', 'Dublin Housing'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        handleSearch(term);
                      }}
                      className="block w-full text-left text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {totalResults > 0 && (
              <div className="mb-6">
                <p className="text-gray-600">
                  {totalResults} resultados encontrados {query && `para "${query}"`}
                </p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Buscando...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {result.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(result.publishedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={result.url} className="hover:text-blue-600 transition-colors">
                        {result.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {result.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Fonte: {result.source}
                      </span>
                      <div className="flex gap-1">
                        {result.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query && !loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Nenhum resultado encontrado para "{query}"
                </p>
                <p className="text-gray-500 mt-2">
                  Tente usar termos diferentes ou verifique a ortografia.
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Busque por notícias sobre a Irlanda
                </h3>
                <p className="text-gray-600">
                  Digite palavras-chave para encontrar artigos sobre universidades, vistos, trabalho e muito mais.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
