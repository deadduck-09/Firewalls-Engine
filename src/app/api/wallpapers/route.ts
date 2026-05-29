import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  const sorting =
    searchParams.get('sorting') || 'relevance';

  const ratios =
    searchParams.get('ratios') || '';

  const url =
    `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(q)}` +
    `&page=${page}` +
    `&sorting=${sorting}` +
    `&purity=100` +
    (ratios ? `&ratios=${ratios}` : '');

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(
        `Wallhaven failed: ${res.status}`
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to fetch wallpapers' },
      { status: 500 }
    );
  }
}