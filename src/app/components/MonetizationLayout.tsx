import { AdUnit } from './GoogleAdSense'

export default function MonetizationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="monetization-wrapper">
      {/* Banner superior - Alta visibilidade */}
      <div className="sticky top-16 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-center">
            <AdUnit 
              adSlot="1234567890"
              adFormat="horizontal"
              style={{ 
                display: 'block',
                width: '728px',
                height: '90px',
                maxWidth: '100%'
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 container mx-auto px-6 py-8">
        {/* Conteúdo principal */}
        <main className="flex-1 min-w-0">
          {children}
          
          {/* Banner no meio do conteúdo */}
          <div className="my-12">
            <AdUnit 
              adSlot="2345678901"
              adFormat="rectangle"
              style={{ 
                display: 'block',
                width: '336px',
                height: '280px',
                margin: '0 auto'
              }}
            />
          </div>
        </main>

        {/* Sidebar com anúncios */}
        <aside className="w-full lg:w-80 space-y-8">
          {/* Skyscraper ad */}
          <div className="sticky top-32">
            <AdUnit 
              adSlot="3456789012"
              adFormat="vertical"
              style={{ 
                display: 'block',
                width: '160px',
                height: '600px',
                margin: '0 auto'
              }}
            />
          </div>
          
          {/* Newsletter signup como monetização indireta */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">
              📧 Newsletter Premium
            </h3>
            <p className="text-emerald-700 mb-4 text-sm">
              Receba insights exclusivos sobre educação na Irlanda, oportunidades de bolsas e análises detalhadas.
            </p>
            <button className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              Assinar Gratuitamente
            </button>
          </div>

          {/* Affiliate links educacionais */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              🎓 Cursos Recomendados
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">English for Academic Purposes</h4>
                <p className="text-sm text-gray-600 mb-3">Prepare-se para estudar na Irlanda</p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Ver Curso →
                </a>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">IELTS Preparation</h4>
                <p className="text-sm text-gray-600 mb-3">Certificação necessária para universidades</p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Ver Curso →
                </a>
              </div>
            </div>
          </div>

          {/* Mais um anúncio no final */}
          <AdUnit 
            adSlot="4567890123"
            adFormat="square"
            style={{ 
              display: 'block',
              width: '300px',
              height: '250px',
              margin: '0 auto'
            }}
          />
        </aside>
      </div>

      {/* Banner inferior fixo - Mobile friendly */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
        <div className="p-2 flex justify-center">
          <AdUnit 
            adSlot="5678901234"
            adFormat="mobile-banner"
            style={{ 
              display: 'block',
              width: '320px',
              height: '50px',
              maxWidth: '100%'
            }}
          />
        </div>
      </div>
    </div>
  )
}
