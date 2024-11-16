'use strict';
const { src, dest, series } = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');

const cleanDist = () => src('./dist-app/*', { read: false }).pipe(clean());

const compileBabel = () =>
    src('./app/**/*.js')
        .pipe(plumber())
        .pipe(
            babel({
                babelrc: true,
            }),
        )
        .pipe(uglify())
        .pipe(dest('./dist-app/'));

const compileFile = () =>
    src('./app/**/*', {
        ignore: ['./app/**/*.js', './app/**/*.md'],
        dot: true,
    }).pipe(dest('./dist-app/'));

const watchApp = done => {
    const stream = nodemon({
        script: './scripts/dev-server.js',
        ext: 'js',
        ignore: [
            '.git/',
            'dist-app/',
            'node_modules/',
            'tests/',
            'app/public',
            'app/sql',
        ],
        tasks: [],
        done: done,
    });
    return stream
        .on('start', () => {
            console.log('Start service!');
        })
        .on('crash', () => {
            console.error('Service crashed!');
            stream.emit('restart', 10);
        })
        .on('exit', () => {
            console.log('Exit service!');
        })
        .on('restart', () => {
            console.log('Restart service!');
        })
        .on('config:update', () => {
            console.log('Update config!');
        });
};

exports.dev = watchApp;
exports.build = series(cleanDist, compileFile, compileBabel);
