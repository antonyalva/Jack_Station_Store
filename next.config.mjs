/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      root: process.cwd(),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kpnoqhntncsdtkfruzie.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Allow placeholder images if needed (though local is fine)
    ],
  },
};

export default nextConfig;
