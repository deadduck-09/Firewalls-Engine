'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-[#070709]/80 backdrop-blur-md border-b border-white/[0.04] sticky top-0 z-40 px-6 md:px-12 py-4 flex items-center justify-between">
      {/* Brand Logo Identity */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
          <Flame className="w-4 h-4 text-white fill-white/10" />
        </div>
        <span className="font-black text-sm uppercase tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Fire<span className="text-red-500">Walls</span>
        </span>
      </Link>

      {/* Global Navigation Hub links */}
      <div className="flex items-center bg-[#111115] border border-white/5 p-1 rounded-xl text-xs font-semibold text-zinc-400">
        <Link href="/" className={`px-4 py-1.5 rounded-lg transition-all ${pathname === '/' ? 'bg-zinc-800 text-white' : 'hover:text-zinc-200'}`}>
          Home
        </Link>
        <Link href="/explore" className={`px-4 py-1.5 rounded-lg transition-all ${pathname.startsWith('/explore') ? 'bg-zinc-800 text-white' : 'hover:text-zinc-200'}`}>
          Explorer
        </Link>
      </div>
    </nav>
  );
}