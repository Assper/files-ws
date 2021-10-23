const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const TemplateLoader = require('./helpers/TemplateLoader')
const { PATHS, IS_DEV } = require('./helpers/constants')

const templates = (new TemplateLoader(PATHS.src, 'html', 'pug')).load((opts) => new HtmlWebpackPlugin(opts))

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src
  },
  output: {
    filename: 'js/[name].[hash].js',
    path: PATHS.dist,
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: { sourceMap: IS_DEV }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: IS_DEV }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: IS_DEV }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: IS_DEV }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: IS_DEV }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'src/assets/**/*',
        to: PATHS.dist,
        transformPath: (target, absolute) => {
          const dirents = absolute.split(/[\/\\]/)
          const index = dirents.indexOf('src')
          return path.join(...dirents.slice(index + 1))
        },
        noErrorOnMissing: IS_DEV
      }]
    }),
    ...templates
  ],
}
