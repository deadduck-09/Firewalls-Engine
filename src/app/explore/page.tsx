'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, LayoutGrid, Monitor, Smartphone } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import WallpaperModal from '@/components/WallpaperModal';
import { Wallpaper } from '@/types/wallpaper';

export const dynamic = 'force-dynamic';
export default function ExplorePage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || 'anime';
  const initialSort = searchParams.get('sorting') || 'relevance';

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [sorting, setSorting] = useState(initialSort);
  const [aspectRatio, setAspectRatio] = useState<string>(''); // 'landscape' | 'portrait'
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

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
  const merged = clearOld
    ? data.data
    : [...prev, ...data.data];

  const unique = merged.filter(
    (wallpaper, index, self) =>
      index === self.findIndex((w) => w.id === wallpaper.id)
  );

  return unique;
});
        setHasMore(
          data.meta?.current_page < data.meta?.last_page
        );
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
    setPage(1);
    fetchWallpapers(1, true);
  }, [query, sorting, aspectRatio, fetchWallpapers]);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
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
  }, [loading, hasMore, fetchWallpapers]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* Control Configuration Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/5 pb-8">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search API inventory..."
            defaultValue={query}
            onKeyDown={(e) => e.key === 'Enter' && setQuery((e.target as HTMLInputElement).value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-900/40 border border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 text-sm text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Orientation Selector Matrix */}
          <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-xl">
            <button
              onClick={() => setAspectRatio('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!aspectRatio ? 'bg-white/10 text-white' : 'text-zinc-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setAspectRatio('landscape')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${aspectRatio === 'landscape' ? 'bg-white/10 text-white' : 'text-zinc-400'}`}
            >
              <Monitor className="w-3 h-3" /> Desktop
            </button>
            <button
              onClick={() => setAspectRatio('portrait')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${aspectRatio === 'portrait' ? 'bg-white/10 text-white' : 'text-zinc-400'}`}
            >
              <Smartphone className="w-3 h-3" /> Mobile
            </button>
          </div>

          <select
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
            className="bg-[#0f0f13] border border-white/5 px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="toplist">Top Rated</option>
            <option value="views">Most Viewed</option>
            <option value="relevance">Relevance</option>
            <option value="random">Randomized</option>
            <option value="date_added">Fresh Uploads</option>
          </select>
        </div>
      </div>

      {/* Fluid Dynamic Layout Output */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wallpapers.map((wp, index) => {
          if (wallpapers.length === index + 1) {
            return (
              <div ref={lastElementRef} key={wp.id}>
                <GlassCard wallpaper={wp} onViewDetails={setSelectedWallpaper} />
              </div>
            );
          }
          return <GlassCard key={wp.id} wallpaper={wp} onViewDetails={setSelectedWallpaper} />;
        })}

        {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>

      <WallpaperModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />
    </div>
  );
}