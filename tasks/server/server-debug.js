var gulp = require('gulp');
var cached = require('gulp-cached');
var del = require('del');
var runSequence = require('run-sequence').use(gulp);
var sourcemaps = require('gulp-sourcemaps');

var settings = require('../settings.js');
var paths = settings.paths.server;


// --------------------------------------------- build ---------------------------------------------
gulp.task('server:clean', function () {
    if (cached.caches['server'])
        delete cached.caches['server'];

    return del([paths.dest + '/**', '!' + paths.dest, '!' + settings.paths.client.dest + '/**']);
});

gulp.task('server:debug:build', function (done) {
    runSequence(
        'server:clean',
        'server:debug:compile',
        done);
});

gulp.task('server:debug:watch', ['server:debug:build'], function() {
    gulp.watch(paths.srcTs, ['server:debug:compile']);
});


// -------------------------------------------- compile --------------------------------------------
var ts = require('gulp-typescript');
var tsProject = ts.createProject(paths.tsConfig, { sortOutput: true });

gulp.task('server:debug:compile', function() {
    return gulp.src(paths.tsTypings.concat(paths.srcTs))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .js
        .pipe(sourcemaps.write('.', { includeContent: false, destPath: paths.dest }))
        .pipe(cached('server', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.dest));
});