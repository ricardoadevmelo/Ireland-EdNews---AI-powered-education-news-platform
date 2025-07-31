import React, { useState } from 'react';

interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  description: string;
  features: string[];
  popular?: boolean;
}

const premiumPlans: PremiumPlan[] = [
  {
    id: 'basic-monthly',
    name: 'Newsletter Premium',
    price: 9.99,
    period: 'monthly',
    description: 'Acesso completo ao conteúdo premium do Ireland EdNews',
    features: [
      '📧 Newsletter diária exclusiva',
      '🎓 Guias detalhados de universidades',
      '💰 Alertas de bolsas de estudo',
      '📊 Relatórios de mercado educacional',
      '🔍 Análises aprofundadas',
      '💬 Acesso ao grupo VIP no Discord',
      '📞 Suporte prioritário'
    ]
  },
  {
    id: 'pro-yearly',
    name: 'Newsletter Premium Anual',
    price: 99.99,
    period: 'yearly',
    description: 'Melhor valor - 2 meses grátis!',
    popular: true,
    features: [
      '✨ Tudo do plano mensal',
      '🎯 Consultoria personalizada (1h/mês)',
      '📚 E-books exclusivos',
      '🎥 Webinars mensais',
      '🏆 Acesso antecipado a novos recursos',
      '💎 Badge de membro VIP',
      '🎁 Brindes exclusivos'
    ]
  }
];

interface NewsletterPremiumProps {
  showPlans?: boolean;
}

const NewsletterPremium: React.FC<NewsletterPremiumProps> = ({ showPlans = true }) => {
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage('');

    try {
      // Track conversion
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'premium_newsletter_signup', {
          event_category: 'conversion',
          event_label: selectedPlan,
          value: premiumPlans.find(p => p.id === selectedPlan)?.price || 0,
        });
      }

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('✅ Inscrição realizada com sucesso! Verifique seu email.');
      setEmail('');
      setSelectedPlan('');
      
    } catch {
      setMessage('❌ Erro ao processar inscrição. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const PlanCard: React.FC<{ plan: PremiumPlan }> = ({ plan }) => (
    <div className={`relative bg-white rounded-xl shadow-lg p-6 ${plan.popular ? 'ring-2 ring-emerald-500' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            🔥 Mais Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="flex items-center justify-center mb-2">
          <span className="text-3xl font-bold text-emerald-600">€{plan.price}</span>
          <span className="text-gray-500 ml-2">/{plan.period === 'monthly' ? 'mês' : 'ano'}</span>
        </div>
        {plan.period === 'yearly' && (
          <p className="text-sm text-emerald-600 font-medium">Economize €20/ano</p>
        )}
        <p className="text-gray-600 mt-2">{plan.description}</p>
      </div>
      
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-emerald-500 mr-2">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => setSelectedPlan(plan.id)}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          selectedPlan === plan.id
            ? 'bg-emerald-600 text-white'
            : plan.popular
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {selectedPlan === plan.id ? '✓ Selecionado' : 'Escolher Plano'}
      </button>
    </div>
  );

  return (
    <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            📧 Newsletter Premium Ireland EdNews
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Receba insights exclusivos, análises aprofundadas e oportunidades únicas 
            para acelerar sua jornada educacional na Irlanda.
          </p>
        </div>

        {showPlans && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {premiumPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                🚀 Comece Agora
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="seu-email@exemplo.com"
                  />
                </div>
                
                {!selectedPlan && (
                  <p className="text-sm text-gray-500 text-center">
                    ⬆️ Selecione um plano acima primeiro
                  </p>
                )}
                
                <button
                  type="submit"
                  disabled={!selectedPlan || !email || isProcessing}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? 'Processando...' : 'Assinar Newsletter Premium'}
                </button>
              </form>
              
              {message && (
                <p className={`mt-4 text-sm text-center ${
                  message.includes('✅') ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {message}
                </p>
              )}
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Pagamento seguro • ❌ Cancele a qualquer momento
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Processado via Stripe • Suporte 24/7
                </p>
              </div>
            </div>
          </>
        )}
        
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            🎯 O que nossos assinantes dizem
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🇧🇷</div>
              <p className="text-gray-600 italic mb-2">
                &ldquo;Consegui minha vaga no Trinity College graças aos insights da newsletter premium!&rdquo;
              </p>
              <p className="font-medium text-gray-900">Maria Silva, Lisboa</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">🇵🇹</div>
              <p className="text-gray-600 italic mb-2">
                &ldquo;As análises de mercado me ajudaram a escolher o curso certo em Dublin.&rdquo;
              </p>
              <p className="font-medium text-gray-900">João Santos, Porto</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">🇮🇪</div>
              <p className="text-gray-600 italic mb-2">
                &ldquo;Conteúdo indispensável para quem quer estudar na Irlanda!&rdquo;
              </p>
              <p className="font-medium text-gray-900">Ana Costa, Cork</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterPremium;
