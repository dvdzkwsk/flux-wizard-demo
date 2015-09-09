import webpackConfig from '../webpack.config';

const KARMA_ENTRY_FILE  = 'karma.entry.js';

function makeDefaultConfig () {
  const preprocessors = {};

  preprocessors[KARMA_ENTRY_FILE] = ['webpack'];
  preprocessors['src/**/*.js']    = ['webpack'];
  preprocessors['src/**/*.jsx']   = ['webpack'];

  return {
    files : [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './' + KARMA_ENTRY_FILE
    ],
    singleRun  : process.env.NODE_ENV === 'production',
    frameworks : ['chai', 'mocha'],
    preprocessors : preprocessors,
    reporters : ['spec'],
    browsers : ['PhantomJS'],
    webpack : {
      devtool : 'inline-source-map',
      resolve : webpackConfig.resolve,
      plugins : webpackConfig.plugins,
      module  : {
        loaders : webpackConfig.module.loaders
      }
    },
    webpackMiddleware : {
      noInfo : true
    },
    plugins : [
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-phantomjs-launcher'),
      require('karma-spec-reporter')
    ]
  };
}

export default (karmaConfig) => karmaConfig.set(makeDefaultConfig());
