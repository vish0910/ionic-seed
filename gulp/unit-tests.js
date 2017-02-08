'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var _ = require('lodash');
var karma = require('karma');
var fs = require('fs');
var wiredep = require('wiredep');

function runTests (singleRun, done) {
    var server = new karma.Server({
        configFile: path.join(__dirname, '/../karma.conf.js'),
        files: listFiles(),
        singleRun: singleRun,
        browsers : ['PhantomJS'],
        autoWatch: !singleRun,
        thresholdReporter: getThresholds()
    }, done);
    server.start();
}

function listFiles() {
    var wiredepOptions = _.extend({}, conf.wiredep, {
        dependencies: true,
        devDependencies: true
    });

    return wiredep(wiredepOptions).js
        .concat([
            path.join(conf.paths.src, '/**/*.module.js'),
            path.join(conf.paths.src, '/**/*.js'),
            path.join(conf.paths.src, '/**/*.spec.js'),
            path.join(conf.paths.src, '/**/*.html')
        ]);
}

function getThresholds() {
    var thresholds = {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0
    };
    var json = JSON.parse(fs.readFileSync('./package.json'));

    if (
        json
        && json.config
        && json.config.coverageThreshold
        && _.isObject(json.config.coverageThreshold)
    ) {
        return _.merge(thresholds, json.config.coverageThreshold);
    }

    return thresholds;
}

gulp.task('test', ['scripts:browser'], function(done) {
    runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
    runTests(false, done);
});
