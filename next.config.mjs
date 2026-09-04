/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // La page est entierement statique : aucun appel dynamique, aucun cookie.
  // Next la pre-rend au build (SSG) et Vercel la sert depuis le CDN.
  poweredByHeader: false,
};

export default nextConfig;
