/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Export statique : la page est entièrement pré-rendue au build et Vercel
  // sert le dossier out/ (voir vercel.json). Pas de serveur Next en production,
  // donc pas d'optimisation d'images à la volée.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
