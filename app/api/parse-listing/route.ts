import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

const SYSTEM = `You extract structured product data from Instagram captions for a padel equipment shop in the UAE.
Return ONLY a JSON object, no markdown, no preamble, with these keys (omit unknowns):
title (string, "<Brand> <Model> <Year if present>"), brand, model, description (clean 1-3 sentence sales description, no emojis, no "DM to buy"),
price_aed (number — if price is in another currency, convert approximately to AED),
condition (one of: new | like-new | good | fair),
category_slug (one of: new-rackets | pre-owned-rackets | racket-handles | tennis-balls),
head_size, weight, grip_size, balance, year (strings).
Rules: a used/pre-owned racket → category_slug "pre-owned-rackets". Brand-new sealed racket → "new-rackets". Grips/overgrips/handles → "racket-handles". Balls → "tennis-balls".`;

export async function POST(req: Request) {
  // Admin-only endpoint
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key === 'sk-ant-placeholder') {
    return NextResponse.json(
      { error: 'AI parsing not configured yet — add a real ANTHROPIC_API_KEY. You can still fill the form manually.' },
      { status: 503 }
    );
  }

  const { caption } = await req.json();
  if (!caption?.trim()) return NextResponse.json({ error: 'Caption is empty' }, { status: 400 });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
      max_tokens: 1000,
      system: SYSTEM,
      messages: [{ role: 'user', content: `Caption:\n${caption}` }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `AI request failed: ${err.slice(0, 200)}` }, { status: 502 });
  }

  const data = await res.json();
  const text: string = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? '';
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return NextResponse.json({ parsed });
  } catch {
    return NextResponse.json({ error: 'Could not parse AI response — try again or fill manually.' }, { status: 502 });
  }
}
