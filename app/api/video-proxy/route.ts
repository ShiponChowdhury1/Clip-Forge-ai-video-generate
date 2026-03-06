import { NextRequest, NextResponse } from "next/server";

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api").replace(/\/api$/, "");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return new NextResponse("Missing path parameter", { status: 400 });
  }

  const backendUrl = `${API_ROOT}${path}`;
  const rangeHeader = request.headers.get("range");

  let response: Response;
  try {
    response = await fetch(backendUrl, {
      headers: rangeHeader ? { Range: rangeHeader } : {},
    });
  } catch {
    return new NextResponse("Failed to fetch video from backend", { status: 502 });
  }

  if (!response.ok && response.status !== 206) {
    return new NextResponse("Video not found", { status: response.status });
  }

  const headers = new Headers();
  headers.set("Content-Type", response.headers.get("Content-Type") || "video/mp4");
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=3600");

  const contentRange = response.headers.get("Content-Range");
  if (contentRange) headers.set("Content-Range", contentRange);

  const contentLength = response.headers.get("Content-Length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(response.body, {
    status: response.status,
    headers,
  });
}
