import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiKey = process.env.NEWS_API_KEY;
  // support optional ?category=slug for filtering
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = category ? `&q=${encodeURIComponent(category)}` : '';
  const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10${query}&apiKey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}
