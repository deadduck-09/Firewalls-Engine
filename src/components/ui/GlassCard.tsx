'use client';

import React from 'react';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { Wallpaper } from '@/types/wallpaper';

interface GlassCardProps {
  wallpaper: Wallpaper;
  onViewDetails: (wallpaper: Wallpaper) => void;
  showHoverActions?: boolean; // Added to control button duplication safely
}

export default function GlassCard({ wallpaper, onViewDetails, showHoverActions = true }: GlassCardProps) {
  return (
    <div 
      onClick={() => onViewDetails(wallpaper)}
      className="relative group aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-900/20 cursor-pointer backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-black/40"
    >
      {/* Background Image Wrapper */}
      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
        <Image
          src={wallpaper.thumbs?.large || wallpaper.path}
          alt={wallpaper.id || 'Wallpaper asset'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Internal Overlay Information */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 pointer-events-none">
        
        {/* Aspect Specs Badge */}
        <div className="flex justify-between items-start">
          <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/5 text-[10px] font-medium tracking-wide text-zinc-300">
            {wallpaper.resolution || 'Ultra HD'}
          </span>
        </div>

        {/* View Details Center Prompt Trigger */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-semibold shadow-xl scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-70">
          <Eye className="w-3.5 h-3.5" />
          Inspect
        </div>

        {/* Built-in controls (Only active if showHoverActions is explicitly allowed) */}
        {showHoverActions && (
          <div className="flex justify-end gap-1.5 pointer-events-auto mt-auto">
            {/* These fallback native buttons can safely stay here for other pages */}
          </div>
        )}
      </div>
    </div>
  );
}