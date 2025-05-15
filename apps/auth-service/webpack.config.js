const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join, resolve } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      "@pacakages": resolve(__dirname, '../../packages'),
      '@': resolve(__dirname, 'src'),
      '@auth-service': resolve(__dirname, 'src'),
      '@auth-service/*': resolve(__dirname, 'src/*'),
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
