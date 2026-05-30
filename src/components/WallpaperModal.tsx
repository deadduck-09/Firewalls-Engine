'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Download, Heart, ChevronLeft, ChevronRight, Copy, Check, Calendar, Loader2 } from 'lucide-react';
import { Wallpaper } from '@/types/wallpaper';

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  wallpapers: Wallpaper[];
  onSelectWallpaper: (wallpaper: Wallpaper | null) => void;
  onSearchTag: (tag: string) => void;
  isFav: boolean;
  onToggleFav: (wallpaper: Wallpaper) => void;
  onClose: () => void;
}

export default function WallpaperModal({
  wallpaper,
  wallpapers,
  onSelectWallpaper,
  onSearchTag,
  isFav,
  onToggleFav,
  onClose
}: WallpaperModalProps) {
  const [imgSrc, setImgSrc] = useState<string>(wallpaper?.path || '');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [fullDetails, setFullDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!wallpaper) return;

    setImgSrc(wallpaper.path);
    setCopied(false);
    setFullDetails(null); 

    const fetchFullDetails = async () => {
      try {
        setLoadingDetails(true);
        
        // Check if this wallpaper belongs to your custom GitHub Repo or Wallhaven
        const isRepoWall = typeof wallpaper.id === 'string' && 
          (wallpaper.id.includes('/') || wallpaper.id.startsWith('git-') || !/^\d+$/);

        let res;
        if (isRepoWall) {
          // Route into your curated collection endpoint
          res = await fetch(`/api/curated`);
          if (!res.ok) throw new Error('Failed to fetch curated repository registry');
          
          const repoData = await res.json();
          if (Array.isArray(repoData)) {
            const matchedMeta = repoData.find(item => String(item.id) === String(wallpaper.id));
            if (matchedMeta) {
              setFullDetails(matchedMeta);
              return;
            }
          }
        } else {
          // Route cleanly through normal proxy route for true Wallhaven items
          res = await fetch(`/api/wallpapers/${wallpaper.id}`);
          if (!res.ok) throw new Error('Failed to get asset details via proxy');
          
          const json = await res.json();
          if (json && json.data) {
            setFullDetails(json.data);
          }
        }
      } catch (err) {
        console.error('Error fetching dynamic asset metadata targets:', err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchFullDetails();
  }, [wallpaper]);

  if (!wallpaper) return null;

  const currentIndex = wallpapers.findIndex((w) => String(w.id) === String(wallpaper.id));
  const hasLeftArrow = currentIndex > 0;
  const hasRightArrow = currentIndex < wallpapers.length - 1;

  const navigateLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLeftArrow) onSelectWallpaper(wallpapers[currentIndex - 1]);
  };

  const navigateRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasRightArrow) onSelectWallpaper(wallpapers[currentIndex + 1]);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(wallpaper.path);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const proxyUrl = `/api/download?url=${encodeURIComponent(wallpaper.path)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Download pipeline failure");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallpaper-${wallpaper.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download asset:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatTimelineDate = (dateVal: any) => {
    if (!dateVal) return "Fetching...";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return String(dateVal);
    }
  };

  const validImgSrc = imgSrc || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const tagsToRender = fullDetails?.tags || wallpaper.tags || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-sm overflow-y-auto subtle-scrollbar">
      {/* Dismiss backdrop overlay click handler */}
      <div className="absolute inset-0 fixed" onClick={onClose} />

      {/* Main Container Core */}
      <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-center z-10 gap-2 md:gap-4 my-auto">
        
        {/* DESKTOP PREVIOUS ARROW BUTTON */}
        <div className="hidden md:flex w-12 h-12 items-center justify-center shrink-0">
          {hasLeftArrow && (
            <button
              onClick={navigateLeft}
              className="p-3 rounded-full bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* INTERIOR LAYOUT FRAME */}
        <div className="relative w-full max-w-5xl bg-[#09090b] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row md:h-[75vh] max-h-none md:max-h-[85vh]">
          
          {/* LEFT INTERIOR ASPECT CANVAS */}
          <div className="relative flex-1 bg-black/40 flex items-center justify-center p-2 sm:p-4 border-b md:border-b-0 md:border-r border-neutral-800/60 min-h-[45vh] sm:min-h-[55vh] md:min-h-0 h-auto md:h-full">
            <div className="relative w-full h-full min-h-[45vh] sm:min-h-[55vh] md:min-h-0 flex items-center justify-center">
              <Image
                src={validImgSrc}
                alt={wallpaper.id ? `Wallpaper ${wallpaper.id}` : "System Display Target"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
                className="object-contain w-full h-full select-none"
                priority
                unoptimized
                onError={() => {
                  if (wallpaper.thumbs?.large && imgSrc !== wallpaper.thumbs.large) {
                    setImgSrc(wallpaper.thumbs.large);
                  }
                }}
              />
            </div>
            
            {/* MOBILE FLOATER DISMISS */}
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-xl bg-black/70 border border-neutral-800 text-neutral-400 hover:text-white transition-colors z-20 md:hidden shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* RIGHT SIDE PANEL: METADATA DETAILS DRAWER */}
          <div className="w-full md:w-80 p-5 sm:p-6 flex flex-col justify-between h-auto md:h-full bg-neutral-950/40 backdrop-blur-md shrink-0">
            <div className="space-y-5 overflow-y-visible md:overflow-y-auto pr-0 md:pr-1 subtle-scrollbar">
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase block mb-0.5">Active Specs</span>
                  <h2 className="text-base font-bold text-neutral-200 tracking-tight">
                    {wallpaper.id ? `#${wallpaper.id}` : 'General Repository'}
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white transition-colors hidden md:block"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Resolution Metrics Panel */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
                  <span className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider block mb-0.5">Resolution</span>
                  <span className="text-xs font-semibold text-neutral-300">
                    {fullDetails?.resolution || wallpaper.resolution || '1920x1080'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
                  <span className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider block mb-0.5">Aspect Ratio</span>
                  <span className="text-xs font-semibold text-neutral-300">
                    {fullDetails?.ratio || wallpaper.ratio || '1.78'}
                  </span>
                </div>
              </div>

              {/* Palette DNA Color Blocks */}
              {(fullDetails?.colors || wallpaper.colors) && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase block">Palette DNA</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(fullDetails?.colors || wallpaper.colors).map((color: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="w-5 h-5 rounded-md border border-black/40 shadow-inner group relative"
                        style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Database Record */}
              <div className="flex items-center gap-2 text-neutral-400 py-2 border-t border-b border-neutral-900/60 my-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className="text-[11px] font-medium text-neutral-400">Timeline Record:</span>
                <span className="text-[11px] text-neutral-300 font-semibold">
                  {formatTimelineDate(fullDetails?.created_at || wallpaper.created_at)}
                </span>
              </div>

              {/* Genre Structural Tags Layout */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase block">Genre Tags</span>
                {loadingDetails ? (
                  <div className="flex items-center gap-2 text-xs text-neutral-500 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                    Parsing live metadata labels...
                  </div>
                ) : tagsToRender.length > 0 ? (
                  <div className="flex flex-wrap gap-1 max-h-[150px] md:max-h-none overflow-y-auto md:overflow-y-visible subtle-scrollbar">
                    {tagsToRender.map((tag: any, idx: number) => {
                      const tagName = typeof tag === 'string' ? tag : (tag.name || tag.id);
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            onSearchTag(tagName);
                            onClose();
                          }}
                          className="px-2 py-0.5 text-[11px] rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-orange-400 hover:border-orange-500/30 transition-all"
                        >
                          #{tagName}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-neutral-600 italic">No associated data tags found</span>
                )}
              </div>
            </div>

            {/* TOUCH PORTABLE BUTTON ROW (SWAP ARROWS FOR TOUCH SCREENS) */}
            <div className="flex md:hidden items-center justify-between gap-4 mt-4 pt-2 border-t border-neutral-900/60">
              <button
                onClick={navigateLeft}
                disabled={!hasLeftArrow}
                className="flex-1 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-1 text-xs"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={navigateRight}
                disabled={!hasRightArrow}
                className="flex-1 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-1 text-xs"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* OPERATIONAL CTA BUTTON GROUP BLOCK */}
            <div className="space-y-2 mt-4 md:mt-4 border-t border-neutral-800/60 pt-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-3 md:py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-950/20"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download Asset'}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onToggleFav(wallpaper)}
                  className="py-2.5 md:py-2 px-3 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 text-neutral-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFav ? 'Saved' : 'Save'}
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className="py-2.5 md:py-2 px-3 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* DESKTOP NEXT ARROW BUTTON */}
        <div className="hidden md:flex w-12 h-12 items-center justify-center shrink-0">
          {hasRightArrow && (
            <button
              onClick={navigateRight}
              className="p-3 rounded-full bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}