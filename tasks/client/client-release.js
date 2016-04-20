var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var merge = require('event-stream').merge;
var uglify = require('gulp-uglify');

var settings = require('../../settings/task-settings.js');
var paths = settings.paths.client;


// --------------------------------------------- build ---------------------------------------------
var inject = require('gulp-inject');
var rev = require('gulp-rev');
var typings = require('gulp-typings');

gulp.task('client:release:clean', function () {
    return del([paths.dest]);
});

gulp.task('client:release:typings', function () {
    return gulp.src(paths.tsTypingsConfig).pipe(typings());
});

gulp.task('client:release:build', ['client:release:clean', 'client:release:typings'], function () {
    var templates = compileTemplates();
    var styles = compileStyles();
    var scripts = compileScripts();
    var libraries = compileLibs();
    var images = copyImages();
    var fonts = copyFonts();

    var index = gulp.src(paths.srcIndex)
        .pipe(gulp.dest(paths.dest))
        .pipe(inject(libraries, { name: 'bower', relative: true }))
        .pipe(inject(merge(styles, scripts), { relative: true }))
        .pipe(inject(templates, { name: 'templates', relative: true }))
        .pipe(gulp.dest(paths.dest));

    return merge(templates, styles, scripts, libraries, images, fonts, index);
});


// ------------------------------------------- templates -------------------------------------------
var angularTemplateCache = require('gulp-angular-templatecache');

var compileTemplates = function () {
    return gulp.src(paths.srcHtml)
        .pipe(angularTemplateCache('templates.js', { module: 'mj.templates' }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));
};


// -------------------------------------------- styles ---------------------------------------------
var less = require('gulp-less');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var cleanCss = require('gulp-clean-css');
var progeny = require('gulp-progeny');
var lessAutoprefix = new lessPluginAutoprefix(settings.autoprefixer);

var compileStyles = function() {
    return gulp.src(paths.srcLess.concat('!**/*.debug.less'))
        .pipe(progeny())
        .pipe(less({ plugins: [lessAutoprefix] }))
        .pipe(cleanCss())
        .pipe(concat('styles.css'))
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));
};


// -------------------------------------------- scripts --------------------------------------------
var angularFilesort = require('gulp-angular-filesort');
var order = require('gulp-order');
var ts = require('gulp-typescript');
var tsProject = ts.createProject(paths.tsConfig);

var compileScripts = function () {
    return gulp.src(paths.tsTypings.concat(paths.srcTs))
        .pipe(ts(tsProject))
        .js
        .pipe(angularFilesort())
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));
};


// --------------------------------------------- libs ----------------------------------------------
var autoprefixer = require('gulp-autoprefixer');
var bowerFiles = require('main-bower-files');
var filter = require('gulp-filter');

var compileLibs = function() {
    var js = gulp.src(bowerFiles())
        .pipe(filter(['**/*.js']))
        .pipe(order(settings.bowerOrder))
        .pipe(uglify())
        .pipe(concat('libraries.js'))
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));

    var css = gulp.src(bowerFiles())
        .pipe(filter(['**/*.css']))
        .pipe(autoprefixer(settings.autoprefixer))
        .pipe(concat('libraries.css'))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));

    return merge(js, css);
};


// ---------------------------------------- fonts & images -----------------------------------------
var flatten = require('gulp-flatten');

var copyImages = function() {
    return gulp.src(paths.srcImg)
        .pipe(gulp.dest(paths.destImg));
};

var copyFonts = function() {
    return gulp.src(paths.srcFonts)
        .pipe(flatten())
        .pipe(gulp.dest(paths.destFonts));
};
