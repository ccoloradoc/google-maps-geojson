var path = require('path');
 var webpack = require('webpack');

 module.exports = {
     entry: './src/js/index.js',
     output: {
         path: path.resolve(__dirname, 'dist/js'),
         filename: 'main.bundle.js'
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             },
             {
                test: /\.(html)$/,
                use: {
                  loader: 'html-loader',
                  options: {
                    attrs: [':data-src']
                  }
                }
            }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };
