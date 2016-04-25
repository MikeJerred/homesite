var gulp = require('gulp');
var cached = require('gulp-cached');
var clone = require('gulp-clone');
var del = require('del');
var livereload = require('gulp-livereload');
var merge = require('event-stream').merge;
var plumber = require('gulp-plumber');
var remember = require('gulp-remember');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');

var settings = require('../../settings/task-settings.js');
var paths = settings.paths.client;

var EE = require('events').EventEmitter;
var plumberOptions = {
    errorHandler: function(error) {
        if (EE.listenerCount(this, 'error') < 3) {
            util.log(
                util.colors.cyan('Plumber') + util.colors.red(' found unhandled error:\n'),
                error.toString()
            );
        }
        this.emit('end');
    }
};


// --------------------------------------------- build ---------------------------------------------
var batch = require('gulp-batch');
var runSequence = require('run-sequence').use(gulp);
var watch = require('gulp-watch');

gulp.task('client:debug:clean', function () {
    cached.caches = {};
    return del([paths.dest]);
});

gulp.task('client:debug:build', function (done) {
    runSequence(
        'client:debug:clean',
        ['client:debug:compile:templates', 'client:debug:compile:styles', 'client:debug:compile:scripts', 'client:debug:compile:images', 'client:debug:compile:fonts'],
        'client:debug:compile:index',
        done);
});

gulp.task('client:debug:watch', ['client:debug:build'], function () {
    watch(paths.srcHtml, { read: false }, function() { runSequence('client:debug:compile:templates'); });
    watch(paths.srcLess, { read: false }, function() { runSequence('client:debug:compile:styles'); });
    watch(paths.srcTs, { read: false }, function() { runSequence('client:debug:compile:scripts'); });
    watch(paths.srcImg, { read: false }, function() { runSequence('client:debug:compile:images'); });
    watch(paths.srcFonts, { read: false }, function() { runSequence('client:debug:compile:fonts'); });
    watch(paths.srcIndex, { read: false }, function() { runSequence('client:debug:compile:index'); });

    gulp.watch(paths.builtCssAndJs, function(event) {
        if (event.type == 'added' || event.type == 'deleted') {
            runSequence('client:debug:compile:index');
        }
    });
});


// ------------------------------------------- templates -------------------------------------------
gulp.task('client:debug:clean:templates', function () {
    if (cached.caches['client:debug:templates'])
        delete cached.caches['client:debug:templates'];

    return del([paths.dest + '/**/*.html']);
});

gulp.task('client:debug:compile:templates', function () {
    return gulp.src(paths.srcHtml)
        .pipe(cached('client:debug:templates', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.dest))
        .pipe(livereload());
});


// -------------------------------------------- styles ---------------------------------------------
var less = require('gulp-less');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new lessPluginAutoprefix(settings.autoprefixer);
var progeny = require('gulp-progeny');

gulp.task('client:debug:clean:styles', function () {
    if (cached.caches['client:debug:styles:src'])
        delete cached.caches['client:debug:styles:src'];

    if (cached.caches['client:debug:styles:dest'])
        delete cached.caches['client:debug:styles:dest'];

    return del([paths.dest + '/**/*.{css,less,css.map}']);
});

gulp.task('client:debug:compile:styles', function () {
    var src = gulp.src(paths.srcLess.concat('!**/*.release.less'))
        .pipe(cached('client:debug:styles:src', { optimizeMemory: true }));

    var lessFiles = src
        .pipe(clone())
        .pipe(gulp.dest(paths.dest));

    var cssFiles = src
        .pipe(plumber(plumberOptions))
        .pipe(progeny())
        .pipe(sourcemaps.init())
        .pipe(less({ plugins: [autoprefix] }))
        .pipe(sourcemaps.write('.'))
        .pipe(cached('client:debug:styles:dest', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.dest))
        .pipe(livereload());

    return merge(lessFiles, cssFiles);
});


// -------------------------------------------- scripts --------------------------------------------
var ts = require('gulp-typescript');
var tsProject = ts.createProject(paths.tsConfig, { sortOutput: true });

gulp.task('client:debug:clean:scripts', function () {
    if (cached.caches['client:debug:scripts:src'])
        delete cached.caches['client:debug:scripts:src'];

    if (cached.caches['client:debug:scripts:dest'])
        delete cached.caches['client:debug:scripts:dest'];

    return del([paths.dest + '/**/*.{js,js.map,ts,d.ts}']);
});

gulp.task('client:debug:compile:scripts', function () {
    var tsFiles = gulp.src(paths.srcTs)
        .pipe(cached('client:debug:scripts:src', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.dest));

    var jsFiles = gulp.src(paths.tsTypings.concat(paths.srcTs))
        .pipe(plumber(plumberOptions))
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(cached('client:debug:scripts:dest', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.dest))
        .pipe(livereload());

    return merge(tsFiles, jsFiles);
});


// ---------------------------------------- fonts & images -----------------------------------------
var flatten = require('gulp-flatten');

gulp.task('client:debug:clean:other', function() {
    if (cached.caches['client:debug:images'])
        delete cached.caches['client:debug:images'];

    if (cached.caches['client:debug:fonts'])
        delete cached.caches['client:debug:fonts'];

    return del([paths.destImg, paths.destFonts]);
});

gulp.task('client:debug:compile:images', function () {
    return gulp.src(paths.srcImg)
        .pipe(plumber(plumberOptions))
        .pipe(cached('client:debug:images', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.destImg))
        .pipe(livereload());
});

gulp.task('client:debug:compile:fonts', function () {
    return gulp.src(paths.srcFonts)
        .pipe(plumber(plumberOptions))
        .pipe(cached('client:debug:fonts', { optimizeMemory: true }))
        .pipe(flatten())
        .pipe(gulp.dest(paths.destFonts))
        .pipe(livereload());
});


// --------------------------------------------- libs ----------------------------------------------
gulp.task('client:debug:clean:libs', function() {
    if (cached.caches['client:debug:libs'])
        delete cached.caches['client:debug:libs'];

    return del([paths.destLibs]);
});


// --------------------------------------------- index ---------------------------------------------
var angularFilesort = require('gulp-angular-filesort');
var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var order = require('gulp-order');

gulp.task('client:debug:compile:index', function () {
    var libraries = gulp.src(bowerFiles())
        .pipe(cached('client:debug:libs', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.destLibs))
        .pipe(remember('client:debug:libs'))
        .pipe(order(settings.bowerOrder));

    var styles = gulp.src(paths.builtCssNoLibs, { read: false });

    var scripts = gulp.src(paths.builtJsNoLibs)
        .pipe(angularFilesort());

    var index = gulp.src(paths.srcIndex)
        .pipe(plumber(plumberOptions))
        .pipe(gulp.dest(paths.dest))
        .pipe(inject(libraries, { name: 'bower', relative: true }))
        .pipe(inject(merge(styles, scripts), { relative: true }))
        .pipe(gulp.dest(paths.dest))
        .pipe(livereload());

    return merge(libraries, index);
});
