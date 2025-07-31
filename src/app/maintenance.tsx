export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-md">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Site em Manutenção
        </h1>
        
        <p className="text-xl text-blue-100 mb-8">
          Estamos trabalhando para melhorar sua experiência.
          <br />
          Voltaremos em breve!
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <p className="text-sm text-blue-200">
            Para atualizações, entre em contato:
            <br />
            <a href="mailto:contato@ireland-ednews.com" className="text-white underline hover:text-blue-200">
              contato@ireland-ednews.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
