'use client';

import { useState, useEffect } from 'react';

interface NewsletterStats {
  total: number;
  active: number;
  recent: number;
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<NewsletterStats | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('🎉 Inscrição realizada com sucesso! Obrigado por se juntar à nossa comunidade.');
        setEmail('');
        setName('');
        fetchStats(); // Atualizar estatísticas
      } else {
        setError(data.error || 'Erro ao processar inscrição');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/newsletter');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  // Buscar estatísticas ao carregar componente
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border border-green-200">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            📧 Newsletter Ireland EdNews
          </h3>
          <p className="text-gray-600">
            Receba as últimas notícias sobre educação e aprendizagem online na Irlanda
          </p>
          
          {stats && (
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
              <span>📊 {stats.total} inscritos</span>
              <span>✅ {stats.active} ativos</span>
              <span>🆕 {stats.recent} esta semana</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome (opcional)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="seu.email@exemplo.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '📤 Inscrevendo...' : '✉️ Inscrever-se'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>📮 Enviamos apenas conteúdo relevante sobre educação</p>
          <p>🔐 Seus dados são protegidos e nunca compartilhados</p>
          <p>📱 Cancele a qualquer momento</p>
        </div>
      </div>
    </div>
  );
}
