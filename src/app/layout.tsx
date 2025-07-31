import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import GoogleAnalytics from './components/GoogleAnalytics';
import GoogleAdSense from './components/GoogleAdSense';
import GoogleSearchConsole from './components/GoogleSearchConsole';
import StructuredData from './components/StructuredData';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ireland-ednews-ricardo.vercel.app'),
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
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ireland EdNews - Educação na Irlanda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ireland EdNews",
    description: "Notícias educacionais da Irlanda com IA",
    images: ["/images/twitter-image.jpg"],
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
        <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-emerald-100">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  🇮🇪 Ireland EdNews
                </Link>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                  Início
                </Link>
                <Link href="/news" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                  Notícias
                </Link>
                <Link href="/search" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                  Busca Avançada
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <a href="/api/rss" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                  RSS Feed
                </a>
                <a href="mailto:contato@ireland-ednews.com" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                  Contato
                </a>
              </div>
              
              <div className="md:hidden">
                <button className="text-emerald-600 hover:text-emerald-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="min-h-screen">
          {children}
        </main>
        
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
