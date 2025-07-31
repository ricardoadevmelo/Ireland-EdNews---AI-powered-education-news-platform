'use client';

import { useState, useEffect } from 'react';

interface ContentStats {
  totalArticles: number;
  todayArticles: number;
  weeklyViews: number;
  categories: { name: string; count: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<ContentStats>({
    totalArticles: 0,
    todayArticles: 0,
    weeklyViews: 0,
    categories: []
  });

  useEffect(() => {
    // Mock data loading
    setStats({
      totalArticles: 1250,
      todayArticles: 12,
      weeklyViews: 8450,
      categories: [
        { name: 'Universidades', count: 345 },
        { name: 'Vistos', count: 280 },
        { name: 'Bolsas', count: 190 },
        { name: 'Trabalho', count: 225 },
        { name: 'Acomodação', count: 210 }
      ]
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total de Artigos</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalArticles}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">Artigos Hoje</h3>
            <p className="text-3xl font-bold text-green-600">{stats.todayArticles}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">Visualizações (Semana)</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.weeklyViews}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">Categorias</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.categories.length}</p>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Artigos por Categoria</h2>
          <div className="space-y-4">
            {stats.categories.map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{category.name}</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}