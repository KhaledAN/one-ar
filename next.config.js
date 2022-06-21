/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { dev }) {
    config.module.rules.push({
      test: /zcv\.wasm$/,
      type: "javascript/auto",
      loader: "file-loader",
      options: {
        outputPath: "static/",
      },
    });
    config.resolve.extensions.push(".wasm");
    return config;
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
