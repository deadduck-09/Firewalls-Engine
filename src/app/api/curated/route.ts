import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const owner = 'deadduck-09';
    const repo = 'FireWalls';
    const path = 'Desktop/Wallpapers';

    const targetUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'FireWalls-Engine-App'
      },
      next: { revalidate: 0 } // Disable cache so reloading always mixes the random selection
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const files = await response.json();
    
    if (Array.isArray(files)) {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp'];
      
      // Filter out files that aren't images
      let imgFiles = files.filter(f => 
        f.type === 'file' && 
        imageExtensions.some(ext => f.name.toLowerCase().endsWith(ext))
      );

      // Randomly shuffle the arrays using the Fisher-Yates algorithm
      for (let i = imgFiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imgFiles[i], imgFiles[j]] = [imgFiles[j], imgFiles[i]];
      }

      // Convert the GitHub file references into standard wallpaper object schemas
      const mappedWallpapers = imgFiles.map((file, index) => {
        // Clean up filenames for the title display
        const titleClean = file.name
          .replace(/\.[^/.]+$/, "") // Remove file extension
          .replace(/[-_]/g, " ");   // Replace dashes and underscores with spaces

        return {
          id: `git-${index}-${file.sha?.slice(0, 7)}`,
          path: file.download_url,
          thumbs: {
            large: file.download_url,
            original: file.download_url
          },
          resolution: '3840x2160', // Native fallbacks
          ratio: '1.78',
          category: 'Curated Repo',
          created_at: new Date().toISOString(),
          colors: ['#070709', '#f97316', '#ef4444'],
          tags: [
            { id: 1, name: 'GitHub' },
            { id: 2, name: 'Desktop' },
            { id: 3, name: 'Curated' }
          ],
          title: titleClean
        };
      });

      return NextResponse.json(mappedWallpapers);
    }

    return NextResponse.json([]);
  } catch (error: any) {
    console.error("Repository tracking loop exception:", error.message);
    
    // Safety Fallback backup assets if GitHub API experiences rate-limiting
    const backupCollection = [
      {
        id: 'git-fallback-1',
        path: 'https://w.wallhaven.cc/full/85/wallhaven-85166v.jpg',
        thumbs: { large: 'https://th.wallhaven.cc/small/85/85166v.jpg' },
        resolution: '3840x2160',
        ratio: '1.78',
        category: 'Backup Matrix',
        title: 'Network Core Fallback'
      },
      {
        id: 'git-fallback-2',
        path: 'https://w.wallhaven.cc/full/dg/wallhaven-dg9393.jpg',
        thumbs: { large: 'https://th.wallhaven.cc/small/dg/dg9393.jpg' },
        resolution: '2560x1600',
        ratio: '1.60',
        category: 'Backup Matrix',
        title: 'System Drive Mirror'
      }
    ];
    return NextResponse.json(backupCollection);
  }
}