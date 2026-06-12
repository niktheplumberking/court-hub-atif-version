import type { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase/admin';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
  { url: `${SITE_URL}/shop`, changeFrequency: 'daily', priority: 0.9 },
  { url: `${SITE_URL}/construct-your-court`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('products')
      .select('slug, created_at')
      .eq('status', 'active');

    if (error || !data) return STATIC_ROUTES;

    const productRoutes: MetadataRoute.Sitemap = data.map((p) => ({
      url: `${SITE_URL}/shop/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : undefined,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...STATIC_ROUTES, ...productRoutes];
  } catch {
    // Missing Supabase env locally (or any runtime failure) — degrade
    // gracefully to the static routes instead of breaking the build.
    return STATIC_ROUTES;
  }
}
