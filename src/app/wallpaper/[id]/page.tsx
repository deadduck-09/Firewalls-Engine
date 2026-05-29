'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'react-router-dom'; 
import { useParams as useNextParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Download, Heart, Copy, Check, Monitor, ShieldAlert } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { Wallpaper } from '@/types/wallpaper';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function WallpaperDetailsPage() {
  const params = useNextParams();
  const router = useRouter();
  const id = params?.id as string;

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Fetch the single wallpaper details from our proxy API
    // Wallhaven API supports fetching a single wallpaper via: /w/id
    const fetchSingleWallpaper = async () => {
      try {
        setLoading(true);
        // We can append a direct query or update our proxy, 
        // but for simplicity, we can fetch via the search proxy using the ID as the query
        const res = await fetch(`/api/wallpapers?q=${id}`);
        const data = await res.json();
        
        if (data.data && data.data.length > 0) {
          setWallpaper(data.data[0]);
        }
      } catch (err) {
        console.error('Error fetching wallpaper details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleWallpaper();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <div className="h-64 bg-zinc-900/50 rounded-3xl animate-pulse dynamic-shimmer" />
          <div className="h-6 bg-zinc-800 rounded-md w-1/3 mx-auto" />
        </div>
      </div>
    );
  }

  if (!wallpaper) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold">Wallpaper Not Found</h2>
        <button onClick={() => router.push('/')} className="text-sm text-rose-400 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const favorited = isFavorite(wallpaper.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(wallpaper.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-7xl mx-auto px-6 py-12 lg:py-20">
      {/* Back Navigation */}
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 group transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        Back to browsing
      </button>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-[#0d0d11]/40 border border-white/[0.05] rounded-3xl overflow-hidden backdrop-blur-xl p-6 md:p-10 shadow-2xl">
        
        {/* Left Container: Massive Visual Frame */}
        <div className="lg:col-span-2 relative flex items-center justify-center rounded-2xl bg-black/40 min-h-[40vh] lg:min-h-[60vh] p-4 border border-white/5">
          <div className="absolute inset-0 opacity-10 filter blur-3xl pointer-events-none" style={{ backgroundColor: wallpaper.colors?.[0] || '#1a1a24' }} />
          <div className="relative w-full h-full min-h-[350px] lg:h-[55vh]">
            <Image
              src={wallpaper.path}
              alt="Premium ultra-high-resolution canvas"
              fill
              className="object-contain rounded-xl select-none"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
          </div>
        </div>

        {/* Right Container: Metadata & Processing Engine */}
        <div className="flex flex-col justify-between space-y-8 lg:py-4">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-rose-400 tracking-widest uppercase block mb-1">
                {wallpaper.category} Identity
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Asset #{wallpaper.id}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <span className="text-xs text-zinc-500 block mb-0.5">Resolution</span>
                <span className="text-sm font-mono font-semibold text-zinc-200">{wallpaper.resolution}</span>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <span className="text-xs text-zinc-500 block mb-0.5">Aspect Ratio</span>
                <span className="text-sm font-mono font-semibold text-zinc-200">{wallpaper.ratio}</span>
              </div>
            </div>

            {wallpaper.colors && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-zinc-400 block">Color Palette DNA</span>
                <div className="flex flex-wrap gap-2">
                  {wallpaper.colors.map((color, idx) => (
                    <div 
                      key={idx} 
                      className="w-9 h-9 rounded-xl border border-white/10 shadow-md transform hover:scale-105 transition-transform" 
                      style={{ backgroundColor: color }} 
                      title={color} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Call to Actions / Downloads Matrix */}
          <div className="space-y-3 pt-6 border-t border-white/5">
            <a
              href={wallpaper.path}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-semibold rounded-2xl transition-all shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 group"
            >
              <Download className="w-5 h-5 transform group-hover:translate-y-0.5 transition-transform" /> 
              Get High-Res Original
            </a>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => (favorited ? removeFavorite(wallpaper.id) : addFavorite(wallpaper))}
                className={`py-3 px-4 border rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 ${
                  favorited
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                    : 'bg-white/[0.02] border-white/10 text-zinc-300 hover:bg-white/[0.06]'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} /> 
                {favorited ? 'Favorited' : 'Save'}
              </button>
              <button
                onClick={handleCopy}
                className="py-3 px-4 bg-white/[0.02] border border-white/10 text-zinc-300 hover:bg-white/[0.06] rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied URL' : 'Share Asset'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}