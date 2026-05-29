'use client';

import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import SkeletonCard from './ui/SkeletonCard';
import { Wallpaper } from '@/types/wallpaper';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  loading: boolean;
  onViewDetails: (wallpaper: Wallpaper) => void;
  lastElementRef?: (node: HTMLDivElement) => void;
}

export default function WallpaperGrid({
  wallpapers,
  loading,
  onViewDetails,
  lastElementRef,
}: WallpaperGridProps) {
  
  if (!loading && wallpapers.length === 0) {
    return (
      <div className="w-full py-24 text-center border border-white/[0.04] bg-zinc-900/10 rounded-3xl backdrop-blur-md">
        <p className="text-zinc-500 font-medium tracking-wide text-sm">
          No matching visual assets found in the cluster.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Responsive Grid Grid-System
        Uses a dynamic column structure that changes based on screen sizes.
        Includes a smooth stagger effect container for internal card animations.
      */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {wallpapers.map((wallpaper, index) => {
          const isLastElement = wallpapers.length === index + 1;

          return (
            <div
              key={`${wallpaper.id}-${index}`}
              ref={isLastElement ? lastElementRef : undefined}
              className="w-full"
            >
              <GlassCard 
                wallpaper={wallpaper} 
                onViewDetails={onViewDetails} 
              />
            </div>
          );
        })}

        {/* Append Skeleton placeholders seamlessly when loading next infinite scroll pages */}
        {loading &&
          Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={`skeleton-${idx}`} />
          ))}
      </motion.div>
    </div>
  );
}