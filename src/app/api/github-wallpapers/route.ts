import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.github.com/repos/deadduck-09/FireWalls/contents/Desktop/Wallpapers',
      {
        next: { revalidate: 60 },
      }
    );

    const files = await response.json();

    const wallpapers = files
      .filter((file: any) =>
        /\.(jpg|jpeg|png|webp)$/i.test(file.name)
      )
      .map((file: any, index: number) => ({
        id: `github-${index}`,
        url: file.html_url,
        path: file.download_url,
        thumbs: {
          large: file.download_url,
          original: file.download_url,
        },
        resolution: 'Wallpaper',
        ratio: '16:9',
        category: 'Curated',
        colors: ['#111111'],
        curatedVibe: 'Personal Collection',
        isCurated: true,
      }));

    return NextResponse.json(wallpapers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch wallpapers' },
      { status: 500 }
    );
  }
}