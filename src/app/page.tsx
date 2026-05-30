'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Search, ChevronRight, Shuffle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import WallpaperModal from '@/components/WallpaperModal';
import { Wallpaper } from '@/types/wallpaper';

export default function HomePage() {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);

  const [trending, setTrending] = useState<Wallpaper[]>([]);
  const [bestPicks, setBestPicks] = useState<Wallpaper[]>([]);
  const [gitHubWalls, setGitHubWalls] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('firewalls_favs');
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch (e) { console.error(e); }
    }

    const fetchHomeFeeds = async () => {
      try {
        const resHot = await fetch('/api/wallpapers?sorting=hot&per_page=15');
        const dataHot = await resHot.json();
        if (dataHot.data) setTrending(dataHot.data.slice(0, 15));

        const resTop = await fetch('/api/wallpapers?sorting=toplist&per_page=15');
        const dataTop = await resTop.json();
        if (dataTop.data) setBestPicks(dataTop.data.slice(0, 15));

        const resGit = await fetch('/api/curated');
        const dataGit = await resGit.json();
        if (Array.isArray(dataGit)) setGitHubWalls(dataGit.slice(0, 15));
      } catch (err) {
        console.error("Error loading tracks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeFeeds();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    router.push(`/explore?q=${encodeURIComponent(searchVal.trim())}`);
  };

  // RANDOMIZE AUTOMATIC SEARCH PARSER
  const handleRandomize = () => {
    const randomKeywords = [
      'anime', 
      'landscape', 
      'space', 
      'abstract', 
      'cyberpunk', 
      'nature', 
      'minimalism', 
      'pixel art'
    ];
    const pick = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
    router.push(`/explore?q=${encodeURIComponent(pick)}`);
  };

  const toggleFavorite = (wp: Wallpaper) => {
    let updated = favorites.some(f => f.id === wp.id)
      ? favorites.filter(f => f.id !== wp.id)
      : [...favorites, wp];
    setFavorites(updated);
    localStorage.setItem('firewalls_favs', JSON.stringify(updated));
  };

  const combinedModalPool = [...trending, ...bestPicks, ...gitHubWalls];

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center px-4 md:px-8 relative overflow-x-hidden pt-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-4xl text-center space-y-4 z-10 pt-12 pb-10">
        {/* CHANGED: Upper Label Badge Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[10px] text-orange-400 font-bold tracking-widest uppercase">
          <Sparkles className="w-3 h-3 text-red-500 animate-pulse" /> Gigi's
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase relative">
          <span className="bg-gradient-to-r from-orange-600 via-red-500 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(239,68,68,0.25)] animate-gradient bg-[length:200%_auto]">
            FireWalls
          </span>
          {/* CHANGED: Text Heading Below to "A Pretty Wallhaven" */}
          <span className="text-zinc-200 block text-xs tracking-[0.4em] font-light mt-2 uppercase text-center w-full pl-[0.4em]">
            A Pretty Wallhaven ✨️
          </span>
        </h1>
        
        <p className="text-zinc-400 text-xs max-w-md mx-auto font-light leading-relaxed">
          A Collection of Internets Best Wallpapers...
        </p>

        {/* SEARCH AND RANDOMIZE CONTROLS GRID */}
        <div className="w-full max-w-md mx-auto space-y-3 pt-2">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Internet's Fresh Picks..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs text-white placeholder-zinc-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg text-[10px] hover:opacity-90 transition-all"
            >
              Search
            </button>
          </form>

          {/* DYNAMIC SHUFFLE RANDOMIZER ACTION */}
          <button
            onClick={handleRandomize}
            className="w-full py-2 px-4 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-orange-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
          >
            <Shuffle className="w-3.5 h-3.5 text-orange-500 transition-transform group-hover:rotate-45" />
            Randomize Discovery
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl z-10 space-y-10 pb-24">
        
        {/* Row 1: Network Hot */}
        {trending.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-1 flex items-center gap-1">
              <span>⚡</span> Network Hot
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-3 pt-1 pr-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent snap-x scroll-smooth">
              {trending.map((wp) => (
                <div key={wp.id} className="min-w-[240px] md:min-w-[280px] max-w-[280px] snap-start relative scale-[0.98] hover:scale-[1.01] transition-all">
                  <GlassCard wallpaper={wp} onViewDetails={setSelectedWallpaper} />
                </div>
              ))}
              <button 
                onClick={() => router.push('/explore?sorting=hot')}
                className="min-w-[160px] max-w-[160px] snap-start bg-zinc-900/20 border border-dashed border-white/5 hover:border-orange-500/30 rounded-xl flex flex-col items-center justify-center gap-2 group/btn transition-colors text-zinc-400 hover:text-orange-400"
              >
                <span className="text-[11px] font-semibold">View Category</span>
                <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Row 2: Best Picks */}
        {bestPicks.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-1 flex items-center gap-1">
              <span>💎</span> Best Picks
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-3 pt-1 pr-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent snap-x scroll-smooth">
              {bestPicks.map((wp) => (
                <div key={wp.id} className="min-w-[240px] md:min-w-[280px] max-w-[280px] snap-start relative scale-[0.98] hover:scale-[1.01] transition-all">
                  <GlassCard wallpaper={wp} onViewDetails={setSelectedWallpaper} />
                </div>
              ))}
              <button 
                onClick={() => router.push('/explore?sorting=toplist')}
                className="min-w-[160px] max-w-[160px] snap-start bg-zinc-900/20 border border-dashed border-white/5 hover:border-orange-500/30 rounded-xl flex flex-col items-center justify-center gap-2 group/btn transition-colors text-zinc-400 hover:text-orange-400"
              >
                <span className="text-[11px] font-semibold">View Category</span>
                <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Row 3: Curated Repositories */}
        {gitHubWalls.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-1 flex items-center gap-1">
              <span>📦</span> Repo Walls
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-3 pt-1 pr-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent snap-x scroll-smooth">
              {gitHubWalls.map((wp) => (
                <div key={wp.id} className="min-w-[240px] md:min-w-[280px] max-w-[280px] snap-start relative scale-[0.98] hover:scale-[1.01] transition-all">
                  <GlassCard wallpaper={wp} onViewDetails={setSelectedWallpaper} />
                </div>
              ))}
              <Link 
                href="/curated"
                className="min-w-[160px] max-w-[160px] snap-start bg-zinc-900/20 border border-dashed border-white/5 hover:border-orange-500/30 rounded-xl flex flex-col items-center justify-center gap-2 group/btn transition-colors text-zinc-400 hover:text-orange-400 text-center"
              >
                <span className="text-[11px] font-semibold">View All Storage</span>
                <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform mx-auto" />
              </Link>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-center text-xs text-zinc-600 animate-pulse pt-8">
            Streaming matrix array pipelines...
          </p>
        )}
      </div>

      <WallpaperModal 
        wallpaper={selectedWallpaper} 
        wallpapers={combinedModalPool} 
        onSelectWallpaper={setSelectedWallpaper}
        onSearchTag={(tagName) => router.push(`/explore?q=${encodeURIComponent(tagName)}`)}
        isFav={favorites.some(f => f.id === selectedWallpaper?.id)}
        onToggleFav={toggleFavorite}
        onClose={() => setSelectedWallpaper(null)} 
      />
    </div>
  );
}