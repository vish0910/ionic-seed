'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

function scriptsTask () {
    return gulp.src([
        path.join(conf.paths.src, '/**/*.js'),
        path.join(conf.paths.tmp, '/serve/generated/*.js')
    ])
        .pipe($.eslint({
            configFile: path.resolve('./linting/.eslintrc.json'),
            rulePaths: [
                path.resolve('./linting/')
            ]
        }))
        .pipe($.eslint.format())

        .pipe(browserSync.reload({stream: true}))
        .pipe($.size());
}


gulp.task('scripts:staging', scriptsTask);
gulp.task('scripts:emulator', scriptsTask);
gulp.task('scripts:browser', ['configInjector:browser'], scriptsTask);
