import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_DRIVE_CONFIG } from "@/app/lib/googledrive";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const apiKey = GOOGLE_DRIVE_CONFIG.apiKey;

  if (!apiKey) {
    return new NextResponse("Missing API Key", {
      status: 500,
    });
  }

  const url =
    `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    return new NextResponse("Unable to fetch PDF", {
      status: response.status,
    });
  }

  const pdf = await response.arrayBuffer();

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store",
    },
  });
}