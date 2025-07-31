'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ScrapedContent } from '@/lib/content-scraper';

interface SearchFilters {
  category?: string;
  university?: string;
  dateRange?: 'today' | 'week' | 'month' | 'year';
  source?: string;
  relevanceMin?: number;
  contentType?: 'article' | 'guide' | 'news' | 'premium';
}

interface SearchResult {
  query: string;
  filters: SearchFilters;
  results: ScrapedContent[];
  total: number;
  suggestions: string[];
  facets: {
    categories: Array<{name: string, count: number}>;
    universities: Array<{name: string, count: number}>;
    sources: Array<{name: string, count: number}>;
    dateRanges: Array<{range: string, count: number}>;
  };
}

export default function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters, searchPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (searchFilters.category) params.append('category', searchFilters.category);
      if (searchFilters.university) params.append('university', searchFilters.university);
      if (searchFilters.dateRange) params.append('dateRange', searchFilters.dateRange);
      if (searchFilters.source) params.append('source', searchFilters.source);
      if (searchFilters.relevanceMin !== undefined) params.append('relevanceMin', searchFilters.relevanceMin.toString());
      if (searchFilters.contentType) params.append('contentType', searchFilters.contentType);
      params.append('page', searchPage.toString());

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    performSearch(query, filters, 1);
  }, [query, filters, performSearch]);

  const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPage(1);
    performSearch(query, updatedFilters, 1);
  }, [query, filters, performSearch]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
    performSearch(query, {}, 1);
  }, [query, performSearch]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    performSearch(query, filters, newPage);
  }, [query, filters, performSearch]);

  // Initial search on component mount
  useEffect(() => {
    performSearch('', {});
  }, [performSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-8">
      <div className="container mx-auto px-6">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            🔍 Busca Avançada
          </h1>
          <p className="text-gray-600 text-lg">
            Encontre conteúdo sobre educação irlandesa com filtros inteligentes
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por universidades, cursos, vistos..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <FunnelIcon className="h-5 w-5" />
                Filtros
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Universidade</label>
                    <select
                      value={filters.university || ''}
                      onChange={(e) => handleFilterChange({ university: e.target.value || undefined })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Todas as universidades</option>
                      <option value="trinity">Trinity College Dublin</option>
                      <option value="ucd">University College Dublin</option>
                      <option value="dcu">Dublin City University</option>
                      <option value="cork">University College Cork</option>
                      <option value="galway">NUI Galway</option>
                      <option value="maynooth">Maynooth University</option>
                      <option value="limerick">University of Limerick</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                    <select
                      value={filters.dateRange || ''}
                      onChange={(e) => handleFilterChange({ dateRange: e.target.value as SearchFilters['dateRange'] || undefined })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Qualquer período</option>
                      <option value="today">Hoje</option>
                      <option value="week">Última semana</option>
                      <option value="month">Último mês</option>
                      <option value="year">Último ano</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conteúdo</label>
                    <select
                      value={filters.contentType || ''}
                      onChange={(e) => handleFilterChange({ contentType: e.target.value as SearchFilters['contentType'] || undefined })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Todos os tipos</option>
                      <option value="premium">Premium</option>
                      <option value="guide">Guias</option>
                      <option value="news">Notícias</option>
                      <option value="article">Artigos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relevância Mínima</label>
                    <select
                      value={filters.relevanceMin?.toString() || ''}
                      onChange={(e) => handleFilterChange({ relevanceMin: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Qualquer relevância</option>
                      <option value="0.8">Muito alta (80%+)</option>
                      <option value="0.6">Alta (60%+)</option>
                      <option value="0.4">Média (40%+)</option>
                      <option value="0.2">Baixa (20%+)</option>
                    </select>
                  </div>
                </div>

                {Object.keys(filters).length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-emerald-600 hover:text-emerald-800 text-sm flex items-center gap-1"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Limpar filtros
                  </button>
                )}
              </div>
            )}
          </form>

          {/* Search Suggestions */}
          {searchResults?.suggestions && searchResults.suggestions.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Sugestões de busca:</p>
              <div className="flex flex-wrap gap-2">
                {searchResults.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion);
                      performSearch(suggestion, filters);
                    }}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Facets Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrar Resultados</h3>
                
                {/* Categories */}
                {searchResults.facets.categories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Categorias</h4>
                    <div className="space-y-1">
                      {searchResults.facets.categories.slice(0, 5).map((category) => (
                        <button
                          key={category.name}
                          onClick={() => handleFilterChange({ category: category.name })}
                          className="text-left w-full text-sm text-gray-600 hover:text-emerald-600 flex justify-between"
                        >
                          <span>{category.name}</span>
                          <span className="text-gray-400">{category.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Universities */}
                {searchResults.facets.universities.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Universidades</h4>
                    <div className="space-y-1">
                      {searchResults.facets.universities.slice(0, 5).map((university) => (
                        <button
                          key={university.name}
                          onClick={() => handleFilterChange({ university: university.name.toLowerCase() })}
                          className="text-left w-full text-sm text-gray-600 hover:text-emerald-600 flex justify-between"
                        >
                          <span>{university.name}</span>
                          <span className="text-gray-400">{university.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources */}
                {searchResults.facets.sources.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Fontes</h4>
                    <div className="space-y-1">
                      {searchResults.facets.sources.slice(0, 5).map((source) => (
                        <button
                          key={source.name}
                          onClick={() => handleFilterChange({ source: source.name })}
                          className="text-left w-full text-sm text-gray-600 hover:text-emerald-600 flex justify-between"
                        >
                          <span className="truncate">{source.name}</span>
                          <span className="text-gray-400">{source.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                  {searchResults.total} resultados encontrados
                  {query && ` para "${query}"`}
                </p>
              </div>

              {searchResults.results.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <p className="text-gray-500 text-lg">Nenhum resultado encontrado.</p>
                  <p className="text-gray-400 mt-2">Tente ajustar os filtros ou usar termos diferentes.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {searchResults.results.map((article, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-4">
                        {article.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-24 h-24 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                              {article.category}
                            </span>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-500 text-sm">{article.source}</span>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-500 text-sm">
                              {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
                            </span>
                            <div className="ml-auto">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${article.relevanceScore * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 mt-1 block text-center">
                                {Math.round(article.relevanceScore * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-emerald-600 transition-colors">
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                              {article.title}
                            </a>
                          </h3>
                          
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {article.description}
                          </p>
                          
                          {article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  +{article.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {searchResults.total > 20 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex gap-2">
                    {page > 1 && (
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Anterior
                      </button>
                    )}
                    
                    <span className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                      Página {page}
                    </span>
                    
                    {page * 20 < searchResults.total && (
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Próxima
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
