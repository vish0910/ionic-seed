'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

gulp.task('watch', function () {
    gulp.watch(path.join(conf.paths.src, '/**/*'), function(event) {
        gulp.start('default');
    });
});
