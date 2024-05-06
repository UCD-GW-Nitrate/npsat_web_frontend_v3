/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  reactStrictMode: true,
});

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
