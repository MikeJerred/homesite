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
var batch = require('gulp-batch');
var runSequence = require('run-sequence').use(gulp);
var watch = require('gulp-watch');

gulp.task('client:debug:clean',
    [
        'client:debug:clean:other',
        'client:debug:clean:templates',
        'client:debug:clean:styles',
        'client:debug:clean:scripts',
        'client:debug:clean:other',
        'client:debug:clean:icons',
        'client:debug:clean:libs'
    ],
    () =>  del([paths.dest]));

gulp.task('client:debug:build', (done) => {
    runSequence(
        'client:debug:clean',
        [
            'client:debug:compile:templates',
            'client:debug:compile:styles',
            'client:debug:compile:scripts',
            'client:debug:compile:images',
            'client:debug:compile:fonts',
            'client:debug:compile:icons'
        ],
        'client:debug:compile:index',
        done);
});

gulp.task('client:debug:watch', ['client:debug:build'], () => {
    watch(paths.srcHtml, { read: false }, () => { runSequence('client:debug:compile:templates'); });
    watch(paths.srcLess, { read: false }, () => { runSequence('client:debug:compile:styles'); });
    watch(paths.srcTs, { read: false }, () => { runSequence('client:debug:compile:scripts'); });
    watch(paths.srcImg, { read: false }, () => { runSequence('client:debug:compile:images'); });
    watch(paths.srcFonts, { read: false }, () => { runSequence('client:debug:compile:fonts'); });
    watch(paths.srcIcons.concat(paths.srcIconsTemplate), { read: false }, () => { runSequence('client:debug:compile:icons'); });
    watch(paths.srcIndex, { read: false }, () => { runSequence('client:debug:compile:index'); });

    gulp.watch(paths.builtCssAndJs, (event) => {
        if (event.type === 'added' || event.type === 'deleted') {
            runSequence('client:debug:compile:index');
        }
    });
});


// ------------------------------------------- templates -------------------------------------------
gulp.task('client:debug:clean:templates', () => {
    if (cached.caches['client:debug:templates'])
        delete cached.caches['client:debug:templates'];

    return del([paths.dest + '/**/*.html']);
});

gulp.task('client:debug:compile:templates', () =>
    gulp.src(paths.srcHtml)
        .pipe(cached('client:debug:templates', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.dest))
        .pipe(livereload())
);


// -------------------------------------------- styles ---------------------------------------------
var less = require('gulp-less');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new lessPluginAutoprefix(settings.autoprefixer);
var progeny = require('gulp-progeny');

gulp.task('client:debug:clean:styles', () => {
    if (cached.caches['client:debug:styles:src'])
        delete cached.caches['client:debug:styles:src'];

    if (cached.caches['client:debug:styles:dest'])
        delete cached.caches['client:debug:styles:dest'];

    return del([paths.dest + '/**/*.{css,less,css.map}']);
});

gulp.task('client:debug:compile:styles', () => {
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

gulp.task('client:debug:clean:scripts', () => {
    if (cached.caches['client:debug:scripts:src'])
        delete cached.caches['client:debug:scripts:src'];

    if (cached.caches['client:debug:scripts:dest'])
        delete cached.caches['client:debug:scripts:dest'];

    return del([paths.dest + '/**/*.{js,js.map,ts,d.ts}']);
});

gulp.task('client:debug:compile:scripts', () => {
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

gulp.task('client:debug:clean:other', () => {
    if (cached.caches['client:debug:images'])
        delete cached.caches['client:debug:images'];

    if (cached.caches['client:debug:fonts'])
        delete cached.caches['client:debug:fonts'];

    return del([paths.destImg, paths.destFonts]);
});

gulp.task('client:debug:compile:images', () =>
    gulp.src(paths.srcImg)
        .pipe(plumber(plumberOptions))
        .pipe(cached('client:debug:images', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.destImg))
        .pipe(livereload())
);

gulp.task('client:debug:compile:fonts', () =>
    gulp.src(paths.srcFonts)
        .pipe(plumber(plumberOptions))
        .pipe(cached('client:debug:fonts', { optimizeMemory: true }))
        .pipe(flatten())
        .pipe(gulp.dest(paths.destFonts))
        .pipe(livereload())
);


// --------------------------------------------- icons ---------------------------------------------
var consolidate = require('gulp-consolidate');
var iconfont = require('gulp-iconfont');
var rename = require("gulp-rename");

gulp.task('client:debug:clean:icons', () =>
    del([paths.destFonts + '/mj-icons.{svg,ttf,eot,woff}', paths.destIconsTemplate]));

gulp.task('client:debug:compile:icons', () =>
    gulp.src(paths.srcIcons)
        .pipe(plumber(plumberOptions))
        .pipe(iconfont({
            fontName: 'mj-icons',
            formats: ['svg', 'ttf', 'eot', 'woff'],
            normalize: true,
            fontHeight: 1001
        }))
        .on('glyphs', (glyphs, options) => {
            gulp.src(paths.srcIconsTemplate)
                .pipe(plumber(plumberOptions))
                .pipe(consolidate('lodash', {
                    glyphs: glyphs,
                    appendUnicode: false,
                    fontName: 'mj-icons',
                    fontPath: paths.destFonts.substr(paths.dest.length+1)
                }))
                .pipe(rename(paths.destIconsTemplate))
                .pipe(livereload())
                .pipe(gulp.dest(''));
        })
        .pipe(gulp.dest(paths.destFonts))
        .pipe(livereload()));


// --------------------------------------------- libs ----------------------------------------------
gulp.task('client:debug:clean:libs', () => {
    if (cached.caches['client:debug:libs'])
        delete cached.caches['client:debug:libs'];

    return del([paths.destLibs]);
});


// --------------------------------------------- index ---------------------------------------------
var angularFilesort = require('gulp-angular-filesort');
var bowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var inject = require('gulp-inject');
var order = require('gulp-order');

gulp.task('client:debug:compile:index', () => {
    var libraries = gulp.src(bowerFiles())
        .pipe(cached('client:debug:libs', { optimizeMemory: true }))
        .pipe(gulp.dest(paths.destLibs))
        .pipe(remember('client:debug:libs'))
        .pipe(filter(['**/*.{css,js}']))
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
