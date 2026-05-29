'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Heart, ExternalLink, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Wallpaper } from '@/types/wallpaper';
import { useFavoritesStore } from '@/store/useFavoritesStore';

interface ModalProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
}

export default function WallpaperModal({ wallpaper, onClose }: ModalProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const [copied, setCopied] = useState(false);

  if (!wallpaper) return null;
  const favorited = isFavorite(wallpaper.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(wallpaper.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
        {/* Backdrop glass blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Sheet container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-[#0d0d11]/90 border border-white/10 rounded-3xl w-full max-w-6xl h-[85vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-3 z-10 shadow-2xl shadow-black"
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 border border-white/10 text-zinc-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>

          {/* Left / Visual Area */}
          <div className="lg:col-span-2 bg-black/40 relative flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-white/5">
            <div className="absolute inset-0 opacity-20 filter blur-3xl pointer-events-none" style={{ backgroundColor: wallpaper.colors?.[0] || '#1a1a24' }} />
            <div className="relative w-full h-full min-h-[300px] lg:min-h-0 flex items-center justify-center">
              <Image
                src={wallpaper.path}
                alt="High-resolution render"
                fill
                className="object-contain rounded-xl"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>
          </div>

          {/* Right / Information Engine */}
          <div className="p-8 flex flex-col justify-between space-y-8 bg-zinc-950/20">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-rose-400 tracking-widest uppercase block mb-1">Active Specs</span>
                <h2 className="text-2xl font-bold tracking-tight text-white">{wallpaper.category.toUpperCase()} Repository</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <span className="text-xs text-zinc-500 block">Resolution</span>
                  <span className="text-sm font-mono font-medium text-zinc-200">{wallpaper.resolution}</span>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <span className="text-xs text-zinc-500 block">Aspect Ratio</span>
                  <span className="text-sm font-mono font-medium text-zinc-200">{wallpaper.ratio}</span>
                </div>
              </div>

              {wallpaper.colors && (
                <div>
                  <span className="text-xs text-zinc-500 block mb-2">Palette DNA</span>
                  <div className="flex gap-2">
                    {wallpaper.colors.map((color, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-lg border border-white/10 shadow" style={{ backgroundColor: color }} title={color} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <a
                href={wallpaper.path}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-2xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Asset
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
                  <Heart className="w-4 h-4" /> {favorited ? 'Favorited' : 'Save'}
                </button>
                <button
                  onClick={handleCopy}
                  className="py-3 px-4 bg-white/[0.02] border border-white/10 text-zinc-300 hover:bg-white/[0.06] rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Share Link'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}