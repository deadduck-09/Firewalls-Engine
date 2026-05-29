'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Download, Maximize2 } from 'lucide-react';
import { Wallpaper } from '@/types/wallpaper';
import { useFavoritesStore } from '@/store/useFavoritesStore';

interface GlassCardProps {
  wallpaper: Wallpaper;
  onViewDetails: (wp: Wallpaper) => void;
}

export default function GlassCard({ wallpaper, onViewDetails }: GlassCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(wallpaper.id);
  const [loaded, setLoaded] = useState(false);

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    favorited ? removeFavorite(wallpaper.id) : addFavorite(wallpaper.value || wallpaper);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onViewDetails(wallpaper)}
      className="group relative rounded-2xl overflow-hidden bg-zinc-900/40 border border-white/[0.05] aspect-[16/10] md:aspect-auto cursor-pointer"
    >
      {/* Dynamic Skeleton Placeholder */}
      {!loaded && <div className="absolute inset-0 bg-zinc-800/50 animate-pulse dynamic-shimmer" />}

      <Image
        src={wallpaper.thumbs.large}
        alt="Wallpaper preview"
        width={500}
        height={300}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transform scale-100 group-hover:scale-[1.04] transition-all duration-700 ease-out cubic-bezier(0.16, 1, 0.3, 1) ${
          loaded ? 'blur-0 opacity-100' : 'blur-xl opacity-0'
        }`}
      />

      {/* Glassmorphic Overlay Panel */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 backdrop-blur-[2px]">
        <div className="flex justify-end gap-2">
          <button
            onClick={toggleFav}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
              favorited
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {wallpaper.curatedVibe && (
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 block mb-1">
                {wallpaper.curatedVibe}
              </span>
            )}
            <span className="text-xs bg-white/10 px-2 py-1 rounded-md text-zinc-300 font-mono border border-white/5">
              {wallpaper.resolution}
            </span>
          </div>
          <a
            href={wallpaper.path}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-all"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}