var gulp = require('gulp');
var cached = require('gulp-cached');
var del = require('del');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence').use(gulp);
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var watch = require('gulp-watch');

var settings = require('../../settings/task-settings.js');
var paths = settings.paths.server;

var plumberOptions = {
    errorHandler: (error) => {
        util.log(
            util.colors.red('Unhandled error:\n'),
            error.toString()
        );
        gulp.emit('finish');
    }
};

// --------------------------------------------- build ---------------------------------------------
gulp.task('server:clean', () => {
    if (cached.caches['server'])
        delete cached.caches['server'];

    return del([paths.dest + '/**', '!' + paths.dest, '!' + settings.paths.client.dest + '/**']);
});

gulp.task('server:debug:build', (done) => {
    runSequence(
        'server:clean',
        'server:debug:compile',
        'server:debug:copy',
        done);
});

gulp.task('server:debug:watch', ['server:debug:build'], () => {
    watch(paths.srcTs, { read: false }, () => { runSequence('server:debug:compile'); });
    watch(paths.srcOther, { read: false }, () => { runSequence('server:debug:copy'); });
});


// -------------------------------------------- compile --------------------------------------------
var ts = require('gulp-typescript');
var tsProject = ts.createProject(paths.tsConfig, { sortOutput: true });

gulp.task('server:debug:compile', () =>
    gulp.src(paths.tsTypings.concat(paths.srcTs))
        .pipe(plumber(plumberOptions))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .js
        .pipe(sourcemaps.write('.', { includeContent: false, destPath: paths.dest }))
        .pipe(cached('server', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.dest)));


// --------------------------------------------- copy ----------------------------------------------
gulp.task('server:debug:copy', () => gulp.src(paths.srcOther).pipe(gulp.dest(paths.dest)));