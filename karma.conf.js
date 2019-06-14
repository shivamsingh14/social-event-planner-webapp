/* eslint-disable semi */
/* eslint-disable func-names */
// Karma configuration
// Generated on Wed Mar 06 2019 21:00:49 GMT+0530 (India Standard Time)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './socialEventPlanner/bower_components/angular/angular.js',
      './socialEventPlanner/bower_components/angular-ui-router/release/angular-ui-router.js',
      './socialEventPlanner/bower_components/lodash/lodash.js',
      './socialEventPlanner/bower_components/restangular/dist/restangular.js',
      './socialEventPlanner/bower_components/angular-cookies/angular-cookies.js',
      './socialEventPlanner/bower_components/angular-animate/angular-animate.js',
      './socialEventPlanner/bower_components/angular-toastr/dist/angular-toastr.js',
      './socialEventPlanner/bower_components/angular-bootstrap/ui-bootstrap.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './socialEventPlanner/app.module.js',
      './socialEventPlanner/app.constants.js',
      './socialEventPlanner/app.config.js',
      './socialEventPlanner/User/user.module.js',
      './socialEventPlanner/User/user.service.js',
      './socialEventPlanner/User/user.service.spec.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
