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
  const authHeader = request.headers.get("authorization");

  let response: Response;
  try {
    const fetchHeaders: Record<string, string> = rangeHeader ? { Range: rangeHeader } : {};
    if (authHeader) {
      fetchHeaders.Authorization = authHeader;
    }
    response = await fetch(backendUrl, {
      headers: fetchHeaders,
    });
  } catch {
    return new NextResponse("Failed to fetch video from backend", { status: 502 });
  }

  if (!response.ok && response.status !== 206) {
    return new NextResponse("Video not found", { status: response.status });
  }

  const download = searchParams.get("download") === "true";
  const filename = searchParams.get("filename") || "video";

  const headers = new Headers();
  headers.set("Content-Type", response.headers.get("Content-Type") || "video/mp4");
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=3600");

  if (download) {
    const safeFilename = filename.endsWith(".mp4") ? filename : `${filename}.mp4`;
    headers.set("Content-Disposition", `attachment; filename="${safeFilename}"`);
  }

  const contentRange = response.headers.get("Content-Range");
  if (contentRange) headers.set("Content-Range", contentRange);

  const contentLength = response.headers.get("Content-Length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(response.body, {
    status: response.status,
    headers,
  });
}
