'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import HorizontalScrollRow from '@/components/ui/HorizontalScrollRow';
import WallpaperModal from '@/components/WallpaperModal';
import { Wallpaper } from '@/types/wallpaper';

export default function HomePage() {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [apiTrending, setApiTrending] = useState<Wallpaper[]>([]);
  const [curatedCollection, setCuratedCollection] = useState<Wallpaper[]>([]);
  const [animeCollection, setAnimeCollection] = useState<Wallpaper[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);

  useEffect(() => {
    async function loadWallpapers() {
      try {
        // Row A → GitHub Wallpapers
        const githubRes = await fetch('/api/github-wallpapers');
        const githubData = await githubRes.json();

        setCuratedCollection(
          Array.isArray(githubData) ? githubData : []
        );

        // Row B → Global Top Rated
        const trendingRes = await fetch('/api/wallpapers?sorting=toplist');
        const trendingData = await trendingRes.json();

        setApiTrending(
          Array.isArray(trendingData.data) ? trendingData.data : []
        );

        // Row C → Anime Wallpapers
        const animeRes = await fetch('/api/wallpapers?q=anime&sorting=toplist');
        const animeData = await animeRes.json();

        setAnimeCollection(
          Array.isArray(animeData.data) ? animeData.data : []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRows(false);
      }
    }

    loadWallpapers();
  }, []);

  return (
    <div className="pb-24 space-y-16 relative">
      {/* 1. Cinematic Entry Canvas */}
      <Hero />

      {/* 2. Premium Horizontal Streaming Feeds */}
      <div className="space-y-20">
        
        {/* Shimmer loading layout placeholder if network requests are pending */}
        {loadingRows && (
          <div className="px-6 md:px-12 space-y-12">
            {[1, 2].map((row) => (
              <div key={row} className="space-y-4">
                <div className="h-6 bg-zinc-800 rounded w-48 animate-pulse" />
                <div className="flex gap-5 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-[280px] md:w-[360px] h-48 bg-zinc-900/40 border border-white/5 rounded-2xl shrink-0 animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Row B: Global Top-Rated Stream */}
        {!loadingRows && apiTrending.length > 0 && (
          <HorizontalScrollRow 
            title="✨ Network Top Rated" 
            wallpapers={apiTrending} 
            onViewDetails={setSelectedWallpaper} 
          />
        )}

        {/* Row A: Your Local Handpicked Identity Vault */}
        {!loadingRows && curatedCollection.length > 0 && (
          <HorizontalScrollRow 
            title="🔥 My Wallpapers" 
            wallpapers={curatedCollection.slice(0, 15)}
            onViewDetails={setSelectedWallpaper} 
          />
        )}

        {/* Row C: Curated Dynamic Anime Selection */}
        {!loadingRows && animeCollection.length > 0 && (
          <HorizontalScrollRow 
            title="🌌 Anime Vibe Stream" 
            wallpapers={animeCollection} 
            onViewDetails={setSelectedWallpaper} 
          />
        )}
      </div>

      {/* 3. Global Immersive Modals Portal Sheet */}
      <WallpaperModal 
        wallpaper={selectedWallpaper} 
        onClose={() => setSelectedWallpaper(null)} 
      />
    </div>
  );
}