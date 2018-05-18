/* jshint esversion: 6 */
/* global module:false */

const webpack = require('webpack');

module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['tap'],

    // reporters: ['tap-pretty', 'coverage'],
    reporters: ['tap-pretty'],

    // prettifier's: 'faucet', 'tap-spec', 'tap-min', 'tap-diff',
    // 'tap-notify', 'tap-summary', 'tap-markdown'
    tapReporter: {
      prettifier: 'tap-summary',
      // prettifier: 'tap-faucet',
      separator: true
    },

    color: true,
    colors: true,

    browserConsoleLogOptions: {
      level: 'error',
      format: '%b %T: %m',
      terminal: false
    },

    browsers: [
      // 'ChromeIncognito', 
      'Firefox'
    ],

    singleRun: true,

    customLaunchers: {
      ChromeIncognito: {
        base: 'Chrome',
        flags: ['--incognito']
      }
    },

    files: [
      'src/test/karma_spec.js',
    ],

    preprocessors: {
      'src/test/karma_spec.js': ['webpack', 'sourcemap']
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
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
      },
      node: {
        fs: 'empty'
      }
    },

    webpackMiddleware: {
      noInfo: true
    }    
  });
};
