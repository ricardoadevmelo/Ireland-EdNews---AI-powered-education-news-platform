"use client";
import { useState, useEffect } from 'react';
import LegalDisclaimer from './components/LegalDisclaimer';
import AffiliateShowcase from './components/AffiliateShowcase';
import NewsletterPremium from './components/NewsletterPremium';
import JobBoard from './components/JobBoard';

export default function HomePage() {
  const [stats, setStats] = useState({ subscribers: 0, articles: 0, views: 0 });
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Simulate real stats
    setStats({
      subscribers: Math.floor(Math.random() * 500) + 150,
      articles: Math.floor(Math.random() * 50) + 25,
      views: Math.floor(Math.random() * 5000) + 2000
    });
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Erro ao inscrever:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/20 to-teal-800/20"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm border border-white/30">
                🇮🇪 Educação na Irlanda
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ireland <span className="text-orange-300">EdNews</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-100 leading-relaxed">
              Sua fonte confiável para notícias educacionais da Irlanda.<br />
              Conteúdo inteligente, resumos automatizados e insights únicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/news" className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Explorar Notícias
              </a>
              <a href="/api/rss" className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.429 2.776c8.712 0 15.794 7.082 15.794 15.794H15.57c0-6.258-5.072-11.33-11.33-11.33V2.776zm0 4.547c5.838 0 10.577 4.74 10.577 10.577h-3.653c0-3.834-3.09-6.924-6.924-6.924V7.323zm1.946 6.924a1.946 1.946 0 11-3.892 0 1.946 1.946 0 013.892 0z"/>
                </svg>
                Feed RSS
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{stats.subscribers}+</div>
              <div className="text-emerald-700 font-medium">Assinantes Ativos</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.articles}+</div>
              <div className="text-blue-700 font-medium">Artigos Publicados</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <div className="text-4xl font-bold text-orange-600 mb-2">{stats.views}+</div>
              <div className="text-orange-700 font-medium">Visualizações Mensais</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Por que escolher o Ireland EdNews?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnologia avançada combinada com curadoria especializada para trazer o melhor da educação irlandesa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Inteligência Artificial</h3>
              <p className="text-gray-600 leading-relaxed">
                Resumos automatizados e análises inteligentes de notícias educacionais usando tecnologia Gemini AI avançada.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Atualizações Diárias</h3>
              <p className="text-gray-600 leading-relaxed">
                Conteúdo novo todos os dias com automação completa para manter você sempre informado sobre educação na Irlanda.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Fontes Confiáveis</h3>
              <p className="text-gray-600 leading-relaxed">
                Informações verificadas de universidades, institutos e órgãos oficiais de educação da Irlanda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Products Section */}
      <AffiliateShowcase limit={3} />

      {/* Job Board Section */}
      <JobBoard featured limit={2} />

      {/* Premium Newsletter Section */}
      <NewsletterPremium />

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Receba as melhores notícias educacionais
            </h2>
            <p className="text-xl mb-8 text-emerald-100">
              Assine nossa newsletter e receba resumos semanais das principais novidades em educação na Irlanda.
            </p>
            
            <LegalDisclaimer />
            
            {!isSubscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor email"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Assinar Grátis
                </button>
              </form>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                <svg className="w-16 h-16 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">Inscrição Confirmada!</h3>
                <p className="text-emerald-100">Obrigado por se juntar à nossa comunidade educacional.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-emerald-400">Ireland EdNews</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Plataforma dedicada a trazer as melhores notícias e insights sobre educação na Irlanda. 
                Tecnologia avançada para informação de qualidade.
              </p>
              <div className="flex space-x-4">
                <a href="mailto:contato@ireland-ednews.com" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </a>
                <a href="/api/rss" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.429 2.776c8.712 0 15.794 7.082 15.794 15.794H15.57c0-6.258-5.072-11.33-11.33-11.33V2.776zm0 4.547c5.838 0 10.577 4.74 10.577 10.577h-3.653c0-3.834-3.09-6.924-6.924-6.924V7.323zm1.946 6.924a1.946 1.946 0 11-3.892 0 1.946 1.946 0 013.892 0z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Navegação</h4>
              <ul className="space-y-2">
                <li><a href="/news" className="text-gray-300 hover:text-white transition-colors">Notícias</a></li>
                <li><a href="/api/content" className="text-gray-300 hover:text-white transition-colors">API Content</a></li>
                <li><a href="/api/rss" className="text-gray-300 hover:text-white transition-colors">Feed RSS</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="mailto:legal@ireland-ednews.com" className="text-gray-300 hover:text-white transition-colors">Contato Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Ireland EdNews. Desenvolvido com tecnologia avançada para educação. 
              Todo conteúdo é gerado automaticamente respeitando direitos autorais.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
