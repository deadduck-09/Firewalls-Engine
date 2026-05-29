'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Shuffle, Compass, Flame } from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleRandomStream = () => {
    router.push('/explore?sorting=random');
  };

  return (
    <section className="relative w-full h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Premium Ambient Background Engine */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent opacity-70 animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      
      {/* Cyberpunk Grid Overlay Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-4xl space-y-8 relative z-10">
        {/* Aesthetic Curated Mini-Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-xs font-semibold tracking-widest uppercase text-rose-400 mx-auto shadow-inner"
        >
          <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
          Repository Edition v2.0
        </motion.div>

        {/* Cinematic Header Text Layout */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent select-none"
          >
            Fire<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 drop-shadow-[0_2px_20px_rgba(244,63,94,0.2)]">Walls</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-medium tracking-wide"
          >
            A Pretty Wallhaven.
          </motion.p>
        </div>

        {/* Premium Core Search Interface */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSearchSubmit}
          className="relative max-w-2xl mx-auto w-full group pt-2"
        >
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-rose-400 transition-colors z-20" />
          <input
            type="text"
            placeholder="Search landscape, anime rain, ultra-minimal, 4k cyberpunk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-32 py-4 md:py-5 bg-zinc-900/40 hover:bg-zinc-900/60 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-white placeholder-zinc-500 backdrop-blur-xl transition-all shadow-2xl shadow-black/50 text-sm md:text-base"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs md:text-sm font-semibold rounded-xl hover:from-rose-600 hover:to-orange-600 transition-all shadow-md shadow-rose-500/20 active:scale-95"
          >
            Explorer
          </button>
        </motion.form>

        {/* Quick Action Matrix Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-3 pt-2"
        >
          <button 
            onClick={() => router.push('/explore')} 
            className="px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/10 rounded-xl text-xs md:text-sm font-semibold text-zinc-200 transition-all flex items-center gap-2 group shadow-sm backdrop-blur-md"
          >
            <Compass className="w-4 h-4 text-zinc-400 group-hover:rotate-12 transition-transform" /> 
            Browse Network
          </button>
          <button 
            onClick={handleRandomStream} 
            className="px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/10 rounded-xl text-xs md:text-sm font-semibold text-zinc-200 transition-all flex items-center gap-2 group shadow-sm backdrop-blur-md"
          >
            <Shuffle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" /> 
            Random Feed
          </button>
        </motion.div>
      </div>

      {/* Elegant Bottom Edge Vignette Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none" />
    </section>
  );
}