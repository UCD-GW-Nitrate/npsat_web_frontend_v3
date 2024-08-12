/* eslint-disable import/no-extraneous-dependencies */
module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: 'export',
  distDir: 'dist',
  experimental: {
    appDir: true,
  },
};

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// module.exports = withBundleAnalyzer({
//   eslint: {
//     dirs: ['.'],
//   },
//   poweredByHeader: false,
//   trailingSlash: true,
//   basePath: '',
//   reactStrictMode: true,
// });

// module.exports = {
//   async rewrite() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://localhost:8010/api/:path*',
//       },
//     ];
//   },
// };
