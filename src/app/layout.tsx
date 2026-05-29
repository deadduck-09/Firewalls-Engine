import './globals.css';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FireWalls // Premium Aesthetic Wallpaper Repository',
  description: 'A Pretty Wallhaven.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark selection:bg-rose-500 selection:text-white"
    >
      <body className="bg-[#0a0a0c] text-zinc-100 font-sans antialiased overflow-x-hidden min-h-screen dynamic-scroll">
        {/* Ambient background glow */}
        <div className="fixed pointer-events-none top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[160px] z-0" />
        <div className="fixed pointer-events-none bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[140px] z-0" />

        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}