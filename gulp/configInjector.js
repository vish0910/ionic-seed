'use strict';

var path = require('path');
var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var conf = require('./conf');
var pkg = require('../package.json');

function injectConfigTask (env) {
    var now = new Date().toGMTString(),
        endPoints = pkg.config.END_POINTS[env];


    return gulp.src([path.join(conf.paths.generated, 'config.module.js')])
        .pipe(replace('VER', null, stringify(pkg.version)))
        .pipe(replace('BUILD_DATE', null, stringify(now)))
        .pipe(replace('API_END_POINT', null, stringify(endPoints.API)))
        .pipe(replace('devMode', true, endPoints.devMode))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/generated')));
}

function replace(key, oldValue, newValue) {
    return $.replace(
        "'" + key + "': " + oldValue,
        "'" + key + "': " + newValue
    );
}
function stringify(val) {
    return "'" + val + "'";
}

gulp.task('configInjector:staging', function () {
    return injectConfigTask('staging');
});

gulp.task('configInjector:emulator', function () {
    return injectConfigTask('emulator');
});

gulp.task('configInjector:browser', function () {
    return injectConfigTask('browser');
});
