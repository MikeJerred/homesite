var gulp = require('gulp');
var del = require('del');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence').use(gulp);
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');

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
gulp.task('server:release:build', (done) => {
    runSequence(
        'server:clean',
        'server:release:compile',
        'server:release:copy',
        done);
});


// -------------------------------------------- compile --------------------------------------------
var concat = require('gulp-concat');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var tsProject = ts.createProject(paths.tsConfig);

gulp.task('server:release:compile', () =>
    gulp.src(paths.tsTypings.concat(paths.srcTs))
        .pipe(plumber(plumberOptions))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        //.pipe(concat('main.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write('.', { includeContent: false, destPath: paths.dest }))
        .pipe(gulp.dest(paths.dest)));

// --------------------------------------------- copy ----------------------------------------------
gulp.task('server:release:copy', () => gulp.src(paths.srcOther).pipe(gulp.dest(paths.dest)));