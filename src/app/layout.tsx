import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import GoogleAnalytics from './components/GoogleAnalytics';
import GoogleAdSense from './components/GoogleAdSense';
import GoogleSearchConsole from './components/GoogleSearchConsole';
import StructuredData from './components/StructuredData';
import { generateSEOMetadata } from './lib/seo';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ireland EdNews - Educação e Aprendizagem Online",
  description: "Portal de notícias focado em educação e aprendizagem online na Irlanda. Conteúdo inteligente com IA.",
  keywords: "educação irlanda, universidades irlandesas, cursos online, estudar na irlanda, educação superior, trinity college dublin, ucd, cork university",
  authors: [{ name: "Ireland EdNews Team" }],
  openGraph: {
    title: "Ireland EdNews - Educação na Irlanda",
    description: "Sua fonte confiável para notícias educacionais da Irlanda",
    url: "https://ireland-ednews-ricardo.vercel.app",
    siteName: "Ireland EdNews",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ireland EdNews",
    description: "Notícias educacionais da Irlanda com IA",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "add-your-google-verification-code",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <GoogleSearchConsole verificationCode={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🇮🇪</text></svg>" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {/* Modern Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold group-hover:scale-105 transition-transform">
                    IE
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                    Ireland EdNews
                  </span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors relative group">
                  Início
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/news" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors relative group">
                  Notícias
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors relative group">
                  Busca Avançada
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <a href="/api/rss" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors relative group">
                  RSS
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a 
                  href="mailto:contato@ireland-ednews.com" 
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-full hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Contato
                </a>
              </div>
              
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button className="text-gray-600 hover:text-emerald-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
          {children}
        </main>
        
        {/* Modern Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    IE
                  </div>
                  <span className="text-xl font-bold">Ireland EdNews</span>
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                  Sua fonte confiável para notícias sobre educação irlandesa. Conteúdo atualizado automaticamente com IA.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Navegação</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Início</Link></li>
                  <li><Link href="/news" className="text-gray-400 hover:text-white transition-colors">Notícias</Link></li>
                  <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors">Busca Avançada</Link></li>
                  <li><a href="/api/rss" className="text-gray-400 hover:text-white transition-colors">RSS Feed</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Universidades</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Trinity College Dublin</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">University College Dublin</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dublin City University</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">University College Cork</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Ireland EdNews. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <GoogleAdSense ADSENSE_ID={process.env.NEXT_PUBLIC_ADSENSE_ID} />
        )}
        
        {/* Structured Data for SEO */}
        <StructuredData />
        
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
