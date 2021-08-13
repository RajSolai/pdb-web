/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/": { page: "/" },
      "/project": { page: "/project" },
      "/notes": { page: "/notes" },
    };
  },
};
