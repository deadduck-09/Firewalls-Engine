'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Download, Trash2, Heart } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import WallpaperModal from '@/components/WallpaperModal';
import { Wallpaper } from '@/types/wallpaper';

export const dynamic = 'force-dynamic';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialSort = searchParams.get('sorting') || 'date_added';

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [sorting, setSorting] = useState(initialSort);
  const [aspectRatio, setAspectRatio] = useState<string>(''); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  
  const [activeTab, setActiveTab] = useState<'explore' | 'favorites'>('explore');
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [isDownloadingBatch, setIsDownloadingBatch] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('firewalls_favs');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setFavorites(parsed);
      } catch (e) { 
        console.error(e); 
      }
    }
  }, []);

  const toggleFavorite = (wp: Wallpaper) => {
    let updated;
    const isAlreadyFav = favorites.some(f => String(f.id) === String(wp.id));
    
    if (isAlreadyFav) {
      updated = favorites.filter(f => String(f.id) !== String(wp.id));
    } else {
      updated = [...favorites, wp];
    }
    setFavorites(updated);
    localStorage.setItem('firewalls_favs', JSON.stringify(updated));
  };

  // Triggers proxy file downloading for single assets safely
  const triggerSingleDownload = async (e: React.MouseEvent, wp: Wallpaper) => {
    e.stopPropagation();
    try {
      const proxyUrl = `/api/download?url=${encodeURIComponent(wp.path)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Network error");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallpaper-${wp.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Single file download failed:", err);
    }
  };

  const downloadAllFavorites = async () => {
    if (favorites.length === 0 || isDownloadingBatch) return;
    setIsDownloadingBatch(true);
    
    for (const wp of favorites) {
      try {
        const proxyUrl = `/api/download?url=${encodeURIComponent(wp.path)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error("Proxy engine connection drop");
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wallpaper-${wp.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        await new Promise(resolve => setTimeout(resolve, 600));
      } catch (err) {
        console.error(`Skipping item download sequence reference ID ${wp.id}:`, err);
      }
    }
    setIsDownloadingBatch(false);
  };

  const fetchWallpapers = useCallback(async (pageNum: number, clearOld = false) => {
    setLoading(true);
    try {
      let url = `/api/wallpapers?q=${encodeURIComponent(query)}&page=${pageNum}&sorting=${sorting}`;
      if (aspectRatio) {
        url += `&ratios=${aspectRatio === 'landscape' ? '16x9,16x10' : '9x16'}`;
      }
      const res = await fetch(url);
      const data = await res.json();

      if (data.data) {
        setWallpapers((prev) => {
          const merged = clearOld ? data.data : [...prev, ...data.data];
          return merged.filter((w, idx, self) => self.findIndex(item => item.id === w.id) === idx);
        });
        setHasMore(data.meta?.current_page < data.meta?.last_page);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, sorting, aspectRatio]);

  useEffect(() => {
    if (activeTab === 'explore') {
      setPage(1);
      fetchWallpapers(1, true);
    }
  }, [query, sorting, aspectRatio, activeTab, fetchWallpapers]);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || activeTab === 'favorites') return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => {
          const next = prev + 1;
          fetchWallpapers(next);
          return next;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, activeTab, fetchWallpapers]);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() !== '') {
      setSorting('relevance');
    } else {
      setSorting('date_added');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <div className="flex border-b border-white/5 pb-4 items-center justify-between">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab('explore')}
            className={`text-lg font-semibold transition-colors ${activeTab === 'explore' ? 'text-rose-500 border-b-2 border-rose-500 pb-4 -mb-[18px]' : 'text-zinc-400 hover:text-white'}`}
          >
            Explorer
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`text-lg font-semibold transition-colors flex items-center gap-2 ${activeTab === 'favorites' ? 'text-rose-500 border-b-2 border-rose-500 pb-4 -mb-[18px]' : 'text-zinc-400 hover:text-white'}`}
          >
            Favorited <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">{favorites.length}</span>
          </button>
        </div>
      </div>

      {activeTab === 'explore' ? (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search wallpapers (leave blank for latest)..."
              value={query}
              onChange={handleSearchQueryChange}
              className="w-full pl-11 pr-4 py-3 bg-zinc-900/40 border border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 text-sm text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-xl">
              {['', 'landscape', 'portrait'].map((type) => (
                <button
                  key={type}
                  onClick={() => setAspectRatio(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${aspectRatio === type ? 'bg-white/10 text-white' : 'text-zinc-400'}`}
                >
                  {type === '' ? 'All' : type === 'landscape' ? 'Desktop' : 'Mobile'}
                </button>
              ))}
            </div>

            <select
              value={sorting}
              onChange={(e) => setSorting(e.target.value)}
              className="bg-[#0f0f13] border border-white/5 px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="date_added">Fresh Uploads</option>
              <option value="toplist">Top Rated</option>
              <option value="views">Most Viewed</option>
              <option value="relevance">Relevance</option>
              <option value="random">Randomized</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-white/[0.01] border border-white/5 p-4 rounded-xl">
          <div>
            <h2 className="text-sm font-medium text-zinc-300">Your Collected Deck</h2>
            <p className="text-xs text-zinc-500">Assets are preserved locally in your browser cache.</p>
          </div>
          {favorites.length > 0 && (
            <button
              onClick={downloadAllFavorites}
              disabled={isDownloadingBatch}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/40 text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {isDownloadingBatch ? 'Downloading Bundle...' : 'Download Selected Bundle'}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {activeTab === 'explore' ? (
          wallpapers.map((wp, index) => (
            <div ref={wallpapers.length === index + 1 ? lastElementRef : null} key={wp.id} className="relative group/item">
              {/* FIXED: Added showHoverActions={false} to block layout duplicates */}
              <GlassCard wallpaper={wp} onViewDetails={setSelectedWallpaper} showHoverActions={false} />
              
              {/* Clean Proxy Action Controls Layer */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform translate-y-1 group-hover/item:translate-y-0 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(wp);
                  }}
                  className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 transition-colors"
                  title="Toggle Favorite"
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors ${favorites.some(f => String(f.id) === String(wp.id)) ? 'fill-rose-500 text-rose-500' : 'text-zinc-300 hover:text-rose-400'}`} 
                  />
                </button>

                <button
                  onClick={(e) => triggerSingleDownload(e, wp)}
                  className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 text-zinc-300 hover:text-white transition-colors"
                  title="Download Wallpaper"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          favorites.map((wp) => (
            <div key={wp.id} className="relative group/item">
              {/* FIXED: Added showHoverActions={false} to favorites tab too */}
              <GlassCard wallpaper={wp} onViewDetails={setSelectedWallpaper} showHoverActions={false} />
              
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover/item:opacity-100 transition-all duration-200 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(wp);
                  }}
                  className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-rose-400 hover:text-rose-500 transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => triggerSingleDownload(e, wp)}
                  className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white transition-colors"
                  title="Download Wallpaper"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}

        {loading && activeTab === 'explore' && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>

      {activeTab === 'favorites' && favorites.length === 0 && (
        <div className="text-center py-24 border border-dashed border-white/5 rounded-2xl space-y-3">
          <Heart className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-zinc-400 text-sm">No favorited walls found.</p>
        </div>
      )}

      <WallpaperModal 
        wallpaper={selectedWallpaper} 
        wallpapers={activeTab === 'explore' ? wallpapers : favorites}
        onSelectWallpaper={setSelectedWallpaper}
        onSearchTag={(tagName) => { 
          setQuery(tagName); 
          setSorting('relevance'); 
          setActiveTab('explore'); 
        }}
        isFav={favorites.some(f => String(f.id) === String(selectedWallpaper?.id))}
        onToggleFav={toggleFavorite}
        onClose={() => setSelectedWallpaper(null)} 
      />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-4 gap-6"><SkeletonCard /></div>}>
      <ExploreContent />
    </Suspense>
  );
}