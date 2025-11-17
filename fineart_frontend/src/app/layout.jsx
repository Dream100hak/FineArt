import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'FineArt Platform',
  description: 'FineArt – Digital gallery platform for artists, articles, and curated collections.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-body antialiased text-neutral-900`}>
        <div className="min-h-screen bg-[#f7f4d7] text-base text-neutral-900">
          <div className="flex min-h-screen flex-col lg:flex-row">
            <Sidebar />
            <div className="flex min-h-screen flex-1 flex-col bg-body/40">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
