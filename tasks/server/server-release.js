var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence').use(gulp);
var sourcemaps = require('gulp-sourcemaps');

var settings = require('../../settings/task-settings.js');
var paths = settings.paths.server;


// --------------------------------------------- build ---------------------------------------------
gulp.task('server:release:build', function (done) {
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
var tsProject = ts.createProject(paths.tsConfig, { sortOutput: true });

gulp.task('server:release:compile', function() {
    return gulp.src(paths.tsTypings.concat(paths.srcTs))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .js
        //.pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.', { includeContent: false, destPath: paths.dest }))
        .pipe(gulp.dest(paths.dest));
});

// --------------------------------------------- copy ----------------------------------------------
gulp.task('server:release:copy', function() {
    return gulp.src(paths.srcOther)
        .pipe(gulp.dest(paths.dest));
});