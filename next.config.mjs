/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'serraverdeexpress.com.br' },
    ],
  },
};

export default nextConfig;
