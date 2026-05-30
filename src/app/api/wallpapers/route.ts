import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const id = searchParams.get('id');
  const q = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  const sorting = searchParams.get('sorting') || 'date_added';
  const ratios = searchParams.get('ratios') || '';

  const apiKey = process.env.WALLHAVEN_API_KEY || '';

  try {
    // Branch logic: If looking up a single ID details log (CORS bypass mechanism)
    if (id) {
      const detailUrl = `https://wallhaven.cc/api/v1/w/${id}?apikey=${apiKey}`;
      const response = await fetch(detailUrl, { next: { revalidate: 60 } });
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Default: General Query Explorer Feed Lists builder endpoint lookups
    let targetUrl = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(q)}&page=${page}&sorting=${sorting}&categories=111&purity=100&apikey=${apiKey}`;
    if (ratios) {
      targetUrl += `&ratios=${ratios}`;
    }

    const response = await fetch(targetUrl, { next: { revalidate: 60 } });
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Backend Proxy failed parsing target data structures:", error);
    return NextResponse.json({ error: "Internal Server Proxy Disruption" }, { status: 500 });
  }
}