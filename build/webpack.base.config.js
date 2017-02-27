const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')

const config = {
  devtool: '#source-map',
  entry: {
    app: './src/client-entry.js',
    vendor: [
      'es6-promise',
      'vue',
      'vue-router',
      'vuex',
      'vuex-router-sync',
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['*', '.js', '.json', '.vue'],
    alias: {
      'public': path.resolve(__dirname, '../public')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'buble-loader',
        exclude: /node_modules/,
        options: {
          objectAssign: 'Object.assign'
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(['css-loader'])
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'stylus-loader'])
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
      new webpack.DefinePlugin({
          //http://stackoverflow.com/questions/34499450/react-webpack-where-to-configure-rest-endpoints
          'process.env.API': JSON.stringify(process.env.API || 'https://demoapi.lvlup.pro/v3/'),
          'process.env.RECAPTCHA_SITE_KEY': JSON.stringify(process.env.RECAPTCHA_SITE_KEY || '6LdEuRYUAAAAAIGPS1gPHss_Aafu91EqLsgC-Cg9'),
      }),
      new webpack.ProvidePlugin({
          $ : "jquery",
      })
  ],
  performance: false
}

if (process.env.NODE_ENV !== 'production') {
  return module.exports = config
}

config.plugins.push(
  // this is needed in webpack 2 for minifying CSS
  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  // minify JS
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
)

module.exports = config
