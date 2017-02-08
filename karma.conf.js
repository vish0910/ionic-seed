'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

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

module.exports = function(config) {

    var configuration = {

        frameworks: ['mocha', 'chai', 'sinon', 'chai-sinon'],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'src-mobile/'
        },

        preprocessors: {
            'src/**/*.html': ['ng-html2js'],
            'src/**/!(*.spec|*.mock|*.run).js': ['coverage']
        },

        coverageReporter: {
            dir: '.stats/coverage',
            reporters: [
                {type: 'html', subdir: 'coverage'},
                {type: 'text-summary'}
            ]
        },

        reporters: ['mocha', 'coverage', 'threshold']
    };


    config.set(configuration);
};
