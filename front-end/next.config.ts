/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      // If your Google Drive links use the 'lh3.googleusercontent.com' format:
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Adjust to your backend port
      },
    ],
  },
};

export default nextConfig;