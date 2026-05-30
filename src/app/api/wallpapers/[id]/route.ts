import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Crucial: params is a Promise in Next.js 16+
) {
  try {
    // 1. Explicitly await the dynamic parameters object
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: "Missing or invalid asset ID parameter" },
        { status: 400 }
      );
    }

    // 2. Fetch data safely server-side away from browser CORS blocks
    const response = await fetch(`https://wallhaven.cc/api/v1/w/${id}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Wallhaven backend rejected request with status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("CORS Proxy pipeline connection failure:", error);
    return NextResponse.json(
      { error: "Internal Server Error during endpoint routing" },
      { status: 500 }
    );
  }
}