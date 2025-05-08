/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    disableStaticImages: true,
  },

  async headers() {
    return [
      {
        source: "/dashboard",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=59",
          },
        ],
      },
      {
        source: "/student/Dashboard",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=59",
          },
        ],
      },
      {
        source: "/_next/static/(.*)", // optimisation des fichiers statiques
        headers: [
          {
              key: "Cache-Control",
              value: "no-store",
          
          },
        ],
      },
    ]
  },
}

export default nextConfig
