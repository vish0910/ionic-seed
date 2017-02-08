var fs = require('fs');
var gulp = require('gulp');
var replace = require('gulp-replace');
var conf = require('./conf');

gulp.task('ioconfig', function () {
    var src = conf.paths.webclientionic + 'ionic.io.bundle*.js';
    var ioconfig = fs.readFileSync(".io-config.json", "utf8");
    var start = '"IONIC_SETTINGS_STRING_START";var settings =';
    var end =  '; return { get: function(setting) { if (settings[setting]) { return settings[setting]; } return null; } };"IONIC_SETTINGS_STRING_END"';
    var replaceBy = start + ioconfig + end;

    gulp.src(src)
        .pipe(replace(/"IONIC_SETTINGS_STRING_START([\s\S]*?)IONIC_SETTINGS_STRING_END"/, replaceBy))
        .pipe(gulp.dest(conf.paths.webclientionic));
});
