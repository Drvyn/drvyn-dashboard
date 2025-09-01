// This route is no longer needed as we're using the backend API directly
// Kept for backwards compatibility if needed
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'This endpoint is deprecated. Use the backend API directly.' 
  }, { status: 410 });
}
