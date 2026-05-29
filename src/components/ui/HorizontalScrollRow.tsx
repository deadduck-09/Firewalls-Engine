'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from './GlassCard';
import { Wallpaper } from '@/types/wallpaper';

interface RowProps {
  title: string;
  wallpapers: Wallpaper[];
  onViewDetails: (wp: Wallpaper) => void;
}

export default function HorizontalScrollRow({ title, wallpapers, onViewDetails }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 group/row relative px-6 md:px-12">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
        {title}
      </h2>
      
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-white opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:block"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {wallpapers.map((wp) => (
            <div key={wp.id} className="w-[280px] md:w-[360px] shrink-0 snap-start">
              <GlassCard wallpaper={wp} onViewDetails={onViewDetails} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-white opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:block"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}