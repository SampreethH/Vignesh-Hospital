/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: `npm run build` writes a plain site to /out for Netlify.
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["three"],
};

export default nextConfig;
