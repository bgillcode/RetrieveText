const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './background.ts',
    content: './content.ts',
    popup: './popup.ts',
    styles: './styles.css',
  },
  output: {
    filename: '[name].js',
    path: __dirname,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Extracts the compiled css into separate file
          'css-loader', // Interprets `@import` and `url()` like `import/require()`
          'postcss-loader', // Process CSS with PostCSS
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
