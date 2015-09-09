/**
 * Default Unit Test Suite
 * Will import all files matching *.spec.js within ~/src
 * */
 const context = require.context('../../src', true, /.+\.spec\.js?$/);

 context.keys().forEach(context);

 export default context;
