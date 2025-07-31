import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CategoryTabs from './components/CategoryTabs';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ireland EdNews - Educação e Aprendizagem Online",
  description: "Portal de notícias focado em educação e aprendizagem online na Irlanda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto py-4">
            <CategoryTabs />
          </div>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
