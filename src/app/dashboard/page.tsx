'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CloudArrowDownIcon, 
  CogIcon, 
  DocumentTextIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ContentStats {
  totalArticles: number;
  sourceBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  lastUpdate: string;
  averageRelevanceScore: number;
}

interface TrendingTopic {
  topic: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export default function AutomationDashboard() {
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [updateInProgress, setUpdateInProgress] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/automated-content?action=stats');
      const data = await response.json();
      setStats(data.stats);
      setLastUpdate(data.lastUpdate || '');
      setUpdateInProgress(data.updateInProgress || false);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await fetch('/api/automated-content?action=trending');
      const data = await response.json();
      setTrending(data.topics || []);
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  const triggerUpdate = async (action: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/cron/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchStats();
        await fetchTrending();
      }
    } catch (error) {
      console.error('Error triggering update:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTrending();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchStats();
      fetchTrending();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            🤖 Dashboard de Automação
          </h1>
          <p className="text-gray-600 text-lg">
            Monitoramento em tempo real do sistema de agregação de conteúdo
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CogIcon className="h-6 w-6" />
            Controles de Automação
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => triggerUpdate('full-update')}
              disabled={loading || updateInProgress}
              className="px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors flex items-center gap-2 justify-center"
            >
              <CloudArrowDownIcon className="h-5 w-5" />
              {loading ? 'Atualizando...' : 'Atualização Completa'}
            </button>
            
            <button
              onClick={() => triggerUpdate('premium-update')}
              disabled={loading || updateInProgress}
              className="px-6 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400 transition-colors flex items-center gap-2 justify-center"
            >
              <DocumentTextIcon className="h-5 w-5" />
              Conteúdo Premium
            </button>
            
            <button
              onClick={fetchStats}
              disabled={loading}
              className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2 justify-center"
            >
              <ChartBarIcon className="h-5 w-5" />
              Atualizar Stats
            </button>
          </div>
          
          {updateInProgress && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-yellow-600 animate-spin" />
                <span className="text-yellow-800">Atualização automática em progresso...</span>
              </div>
            </div>
          )}
          
          {lastUpdate && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <span className="text-green-800">
                  Última atualização: {new Date(lastUpdate).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Artigos</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.totalArticles}</p>
                </div>
                <DocumentTextIcon className="h-12 w-12 text-emerald-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fontes Ativas</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {Object.keys(stats.sourceBreakdown).length}
                  </p>
                </div>
                <GlobeAltIcon className="h-12 w-12 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categorias</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {Object.keys(stats.categoryBreakdown).length}
                  </p>
                </div>
                <AcademicCapIcon className="h-12 w-12 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Relevância Média</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {Math.round(stats.averageRelevanceScore * 100)}%
                  </p>
                </div>
                <ChartBarIcon className="h-12 w-12 text-amber-500" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Source Breakdown */}
          {stats && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribuição por Fonte</h3>
              <div className="space-y-4">
                {Object.entries(stats.sourceBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-gray-700 truncate flex-1 mr-4">{source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(stats.sourceBreakdown))) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Tópicos em Tendência</h3>
            <div className="space-y-3">
              {trending.slice(0, 10).map((topic, index) => (
                <div key={topic.topic} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-emerald-600">#{index + 1}</span>
                    <span className="text-gray-700">{topic.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">{topic.count}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      topic.trend === 'up' ? 'bg-green-500' :
                      topic.trend === 'down' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {stats && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribuição por Categoria</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats.categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{category}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Status do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium text-green-800">Sistema Ativo</p>
                <p className="text-sm text-green-600">Agregação funcionando</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <CloudArrowDownIcon className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium text-blue-800">Auto-Update</p>
                <p className="text-sm text-blue-600">A cada 1 hora</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <GlobeAltIcon className="h-8 w-8 text-purple-500" />
              <div>
                <p className="font-medium text-purple-800">Fontes Monitoradas</p>
                <p className="text-sm text-purple-600">5+ universidades irlandesas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
