import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: '25mb' } },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
  async redirects() {
    // FAQ page was removed from the contract scope — its content lives on /contact.
    return [{ source: '/faq', destination: '/contact', permanent: false }];
  },
};

export default nextConfig;
