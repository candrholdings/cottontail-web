#!/usr/bin/env node

!function (path) {
    'use strict';

    var program = require('commander');

    program
        .version('0.0.1')
        .option('-f, --clean', 'Force a clean build, will also clean build on every watch loop')
        .option('-l, --loop', 'After build, watch for new changes and restart the build')
        .option('-n, --nomin', 'Do not minify CSS, JS and PNG')
        .option('-r, --livereload', 'Enable LiveReload server, implies --loop')
        .option('--nolint', 'Do not run JSHint')
        .parse(process.argv);

    program.loop = program.livereload || program.loop;

    require('publishjs')({
        basedir: path.dirname(module.filename),
        cacheKey: {
            md5: require('crypto').createHash('md5').update(require('fs').readFileSync(module.filename)).digest('base64'),
            nomin: !!program.nomin
        },
        clean: program.clean,
        output: 'publish/',
        mixins: [
            program.livereload && require('publishjs-livereload')()
        ],
        processors: {
            assemble: require('publishjs-assemble'),
            cssmin: program.nomin ? 'noop' : require('publishjs-cssmin'),
            less: require('publishjs-less'),
            jsx: require('publishjs-jsx'),
            pngout: program.nomin ? 'noop' : require('publishjs-pngout'),
            jshint: require('publishjs-jshint'),
            uglify: program.nomin ? 'noop' : require('publishjs-uglify')
        },
        pipes: {
            less: function (pipe, callback) {
                pipe.from('less/')
                    .merge()
                    .less()
                    .cssmin()
                    .save('css/all.css')
                    .run(callback);
            },
            'less.pages': function (pipe, callback) {
                pipe.from('less.pages/')
                    .less()
                    .cssmin()
                    .save('css/')
                    .run(callback);
            },
            'css.lib': function (pipe, callback) {
                pipe.from('css.lib/')
                    .save('css/')
                    .run(callback);
            },
            fonts: function (pipe, callback) {
                pipe.from('fonts/')
                    .save('fonts/')
                    .run(callback);
            },
            html: function (pipe, callback) {
                pipe.from('html/')
                    .assemble()
                    .jsx({ blacklist: ['strict'] })
                    .jshint({ expr: true, browser: true, newcap: false })
                    .save('./')
                    .run(callback);
            },
            js: function (pipe, callback) {
                pipe.from('js/')
                    .jsx({ blacklist: ['strict'] })
                    .jshint({ expr: true, browser: true, newcap: false })
                    .merge()
                    .uglify()
                    .save('js/all.js')
                    .run(callback);
            },
            'js.lib': function (pipe, callback) {
                pipe.from(program.nomin ? 'js.lib/' : 'js.lib.min/')
                    .merge('lib.js')
                    .save('js/lib.js')
                    .run(callback);
            },
            'js.pages.index.html': function (pipe, callback) {
                pipe.from('js.pages/index.html/')
                    .merge()
                    .jsx()
                    .uglify()
                    .save('js/index.html.js')
                    .run(callback);
            }
        },
        watch: program.loop
    }).build();
}(
    require('path')
);