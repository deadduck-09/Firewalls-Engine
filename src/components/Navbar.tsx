'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Flame, Compass, Heart, Grid, Layers } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Flame },
    { href: '/explore', label: 'Explorer', icon: Compass },
    { href: '/#curated', label: 'Curated', icon: Layers },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0a0c]/60 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            Fire<span className="text-rose-500">Walls</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.04] p-1.5 rounded-full backdrop-blur-md">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className="relative px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-2 hover:text-white">
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-zinc-400'}`} />
                <span className={isActive ? 'text-white' : 'text-zinc-400'}>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}