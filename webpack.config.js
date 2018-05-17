/* jshint esversion: 6 */

const path = require('path');

const config = {
  entry: './src/index.ts',
  mode: 'development',
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
};

// module build is normal build to be imported in another
// project
const moduleOut = {
  output: {
    filename: 'browsedown.js',
    path: path.resolve(__dirname, 'dist'),
  }
};

// we need the library build, so we can test in the browser
// with karma tests
const libaryOut = {
  output: {
    filename: 'library.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'BrowseDown'
  }
};

module.exports = [
  Object.assign({}, config, moduleOut),
  Object.assign({}, config, libaryOut)
];
