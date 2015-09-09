var path    = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry  : {
    example : [
      path.resolve(__dirname + '/example/index.jsx'),
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/dev-server'
    ]
  },
  output : {
    filename : '[name].js',
    path : __dirname + '/dist',
  },
  target  : 'web',
  plugins : [
    new webpack.DefinePlugin({
      'process.env' : {
        'NODE_ENV' : JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new HtmlWebpackPlugin({
      template : path.resolve(__dirname + '/example/index.html'),
      hash     : true,
      inject   : 'body'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve : {
    extensions : ['', '.js', '.jsx'],
    alias : {
      halcyon : path.resolve(__dirname + '/src/index.js')
    }
  },
  module : {
    loaders : [
      {
        test    : [/\.(js|jsx)?$/],
        include : [
          path.resolve(__dirname + '/example'),
          path.resolve(__dirname + '/src')
        ],
        exclude : /node_modules/,
        loaders : ['react-hot', 'babel?stage=0']
      }
    ]
  }
};
