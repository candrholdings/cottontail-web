#!/usr/bin/env node

!function (path) {
    'use strict';

    if (module.parent) {
        module.exports = build;
    } else {
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

        build(program);
    }

    function build(options, callback) {
        var pipeline = require('publishjs')({
            basedir: path.dirname(module.filename),
            cacheKey: {
                md5: require('crypto').createHash('md5').update(require('fs').readFileSync(module.filename)).digest('base64'),
                nomin: !!options.nomin
            },
            clean: options.clean,
            output: 'publish/',
            mixins: [
                options.livereload && require('publishjs-livereload')()
            ],
            processors: {
                assemble: require('publishjs-assemble'),
                cssmin: options.nomin ? 'noop' : require('publishjs-cssmin'),
                less: require('publishjs-less'),
                jsx: require('publishjs-jsx'),
                pngout: options.nomin ? 'noop' : require('publishjs-pngout'),
                jshint: require('publishjs-jshint'),
                uglify: options.nomin ? 'noop' : require('publishjs-uglify')
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
                        .jsx({ blacklist: ['strict'], modules: 'umd' })
                        .jshint({ expr: true, browser: true, newcap: false })
                        .save('./')
                        .run(callback);
                },
                js: function (pipe, callback) {
                    pipe.from('js/')
                        .jsx({ blacklist: ['strict'], modules: 'umd' })
                        .jshint({ expr: true, browser: true, newcap: false })
                        .merge()
                        .uglify()
                        .save('js/all.js')
                        .run(callback);
                },
                'js.lib': function (pipe, callback) {
                    pipe.from(options.nomin ? 'js.lib/' : 'js.lib.min/')
                        .merge('lib.js')
                        .save('js/lib.js')
                        .run(callback);
                },
                'js.pages.index.html': function (pipe, callback) {
                    pipe.from('js.pages/index.html/')
                        .merge('indexpage.js')
                        .jsx({ blacklist: ['strict'], modules: 'umd' })
                        .uglify()
                        .save('js/index.html.js')
                        .run(callback);
                },
                'js.umd': function (pipe, callback) {
                    pipe.from([
                            pipe.from('js.umd/ui/')
                                .merge('ui.js')
                                .jsx({ blacklist: ['strict'], modules: 'umd' })
                        ])
                        .merge()
                        .uglify()
                        .save('js/umd.js')
                        .run(callback);
                }
            },
            watch: options.loop
        }).build(callback);
    }
}(
    require('path')
);