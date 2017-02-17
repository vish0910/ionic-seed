'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var runSequence = require('run-sequence');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
    return gulp.src([
        path.join(conf.paths.src, '/**/*.html'),
        path.join('!' + conf.paths.src, '/index.html'),
        path.join(conf.paths.tmp, '/serve/app/**/*.html')
    ])
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'app',
            root: '.'
        }))
        .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

function htmlTask(isBrowser) {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: true
    };

    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    if(!isBrowser) {
        return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
            .pipe($.inject(partialsInjectFile, partialsInjectOptions))
            .pipe(assets = $.useref.assets())
            .pipe($.rev())
            .pipe(jsFilter)
            .pipe($.ngAnnotate())
            .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
            .pipe(jsFilter.restore())
            .pipe(cssFilter)
            .pipe($.csso())
            .pipe(cssFilter.restore())
            .pipe(assets.restore())
            .pipe($.useref())
            .pipe($.revReplace())
            .pipe(htmlFilter)
            .pipe($.minifyHtml({
                empty: true,
                spare: true,
                quotes: true,
                conditionals: true
            }))
            .pipe(htmlFilter.restore())
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
            .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
    } else {
        return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
            .pipe($.inject(partialsInjectFile, partialsInjectOptions))
            .pipe(assets = $.useref.assets())
            .pipe($.rev())
            .pipe(assets.restore())
            .pipe($.useref())
            .pipe($.revReplace())
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
            .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
    }
}

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles({
        paths: {
            bowerDirectory: 'bower_components',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        }
    }))
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', ['ionic'],function () {
    var fileFilter = $.filter(function (file) {
        return file.stat.isFile();
    });

    return gulp.src([
        path.join(conf.paths.src, '/**/*'),
        path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
    ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('ionic', function () {
    return gulp.src([
        path.join(conf.paths.src, '/ionic/**/*.min.js')
    ])
        .pipe(gulp.dest(path.join(conf.paths.dist, '/ionic')));
});

gulp.task('clean', function (done) {
    $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

gulp.task('html:staging', function(){
    htmlTask(false);
});
gulp.task('html:emulator', function(){
    htmlTask(false);
});
gulp.task('html:browser', ['inject:browser', 'partials'], function(){
    htmlTask(true);
});

gulp.task('prepare:staging', function() {
    runSequence('configInjector:staging',
                'ioconfig',
                'scripts:staging',
                'styles',
                'inject:staging',
                'partials',
                'html:staging',
                'fonts',
                'other');
});
gulp.task('prepare:emulator',function() {
    runSequence('configInjector:emulator',
        'ioconfig',
        'scripts:emulator',
        'styles',
        'inject:emulator',
        'partials',
        'html:emulator',
        'fonts',
        'other');
});
gulp.task('prepare:browser', ['ioconfig', 'html:browser', 'fonts', 'other']);
gulp.task('prepare:runbrowser', function() {
    runSequence('configInjector:browser',
        'ioconfig',
        'scripts:browser',
        'styles',
        'inject:browser',
        'partials',
        'html:browser',
        'fonts',
        'other',
        'watch');
});
