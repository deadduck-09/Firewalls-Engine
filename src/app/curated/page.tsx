'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import WallpaperModal from '@/components/WallpaperModal';
import { Wallpaper } from '@/types/wallpaper';

export default function CuratedPage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Sync Cache
    const saved = localStorage.getItem('firewalls_favs');
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch (e) { console.error(e); }
    }

    // 2. Load complete repository collection
    fetch('/api/curated')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setWallpapers(data);
      })
      .catch((err) => console.error("Error fetching repository contents:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = (wp: Wallpaper) => {
    let updated;
    if (favorites.some(f => f.id === wp.id)) {
      updated = favorites.filter(f => f.id !== wp.id);
    } else {
      updated = [...favorites, wp];
    }
    setFavorites(updated);
    localStorage.setItem('firewalls_favs', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 min-h-screen">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" /> Curated Repository Core
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Showing files linked directly to the upstream GitHub project assets.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-24 text-xs text-zinc-500 animate-pulse">
          Compiling asset tree matrix...
        </div>
      ) : wallpapers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wallpapers.map((wp) => (
            <div key={wp.id} className="relative group scale-[0.98] hover:scale-[1.01] transition-transform duration-200">
              <GlassCard wallpaper={wp} onViewDetails={setSelectedWallpaper} />
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(wp); }}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 backdrop-blur border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className={`w-3.5 h-3.5 ${favorites.some(f => f.id === wp.id) ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'}`} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-white/5 rounded-2xl text-xs text-zinc-500">
          No assets currently mapped to repository path definitions.
        </div>
      )}

      <WallpaperModal 
        wallpaper={selectedWallpaper} 
        wallpapers={wallpapers}
        onSelectWallpaper={setSelectedWallpaper}
        onSearchTag={() => {}}
        isFav={favorites.some(f => f.id === selectedWallpaper?.id)}
        onToggleFav={toggleFavorite}
        onClose={() => setSelectedWallpaper(null)} 
      />
    </div>
  );
}