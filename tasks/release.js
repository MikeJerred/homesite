var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var clone = require('gulp-clone');
var concat = require('gulp-concat');
var del = require('del');
var filter = require('gulp-filter');
var merge = require('event-stream').merge;
var minifyCss = require('gulp-minify-css');
var progeny = require('gulp-progeny');
var uglify = require('gulp-uglify');

var autoprefixOptions = { browsers: ['> 2%', 'IE 9'] };

var paths = (function () {
    var srcRoot = './client';
    var buildRoot = './wwwroot';

    var srcIndex = srcRoot + '/index.html';

    return {
        tsConfig: './tsconfig.json',
        tsTypings: './typings/browser/**/*.d.ts',

        srcIndex: srcIndex,
        srcHtml: [srcRoot + '/**/*.html', '!' + srcIndex],
        srcLess: [srcRoot + '/**/*.less', '!' + srcRoot + '/**/*.debug.less'],
        srcTs: [srcRoot + '/**/*.ts'],
        srcFonts: ['./bower_components/bootstrap/dist/fonts/*.*'],
        srcImg: [srcRoot + '/images/**/*'],

        dest: buildRoot,
        destFonts: buildRoot + '/fonts',
        destImg: buildRoot + '/images',
        destLibs: buildRoot + '/libs'
    };
})();


// -------------------- build --------------------
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var rev = require('gulp-rev');
var through2 = require('through2');

gulp.task('release:clean', function () {
    return del([paths.dest]);
});

gulp.task('release:build', ['release:clean'], function () {
    var templates = compileTemplates();

    var styles = compileStyles()
        .pipe(concat('styles.css'))
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));

    var scripts = compileScripts();

    var libraries = compileBower();

    var images = copyImages();
    var fonts = copyFonts();

    var index = gulp.src(paths.srcIndex)
        .pipe(gulp.dest(paths.dest))
        .pipe(inject(libraries, { name: 'bower', relative: true }))
        .pipe(inject(merge(styles, scripts), { relative: true }))
        .pipe(inject(templates, { name: 'templates', relative: true }))
        .pipe(gulp.dest(paths.dest));

    return merge(templates, styles, scripts, libraries, images, fonts, iconFont, index);
});

// ------------------- styles -------------------
var less = require('gulp-less');

var compileStyles = function() {
    return gulp.src(paths.srcLess)
        .pipe(progeny())
        .pipe(less())
        .pipe(autoprefixer(autoprefixOptions))
        .pipe(minifyCss({ keepSpecialComments: false }));
};

//------------------ templates ------------------
var angularTemplateCache = require('gulp-angular-templatecache');

var compileTemplates = function() {
    return gulp.src(paths.srcHtml)
        .pipe(angularTemplateCache('templates.js', { module: 'mj.templates' }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));
};

// ------------------- scripts ------------------
var order = require('gulp-order');
var ts = require('gulp-typescript');
var tsProject = ts.createProject(paths.tsConfig);

var compileScripts = function () {
    return gulp.src(paths.srcTs)
        //.src([paths.tsTypings].concat(paths.srcTs))
        .pipe(ts(tsProject))
        .js
        .pipe(angularFilesort())
        //.pipe(order(['app.js', 'views/**/*', 'states/marketing/marketingStates.js', 'states/**/*.js']))
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));
};

// -------------------- bower --------------------
var bowerFiles = require('main-bower-files');

var compileBower = function() {
    var js = gulp.src(bowerFiles())
        .pipe(filter(['**/*.js']))
        .pipe(order(['**jquery.js', '**jquery**', '**lodash**', '**angular.**']))
        //.pipe(uglify())
        .pipe(concat('libraries.js'))
        .pipe(rev())
        .pipe(gulp.dest(paths.destLibs));

    var css = gulp.src(bowerFiles())
        .pipe(filter(['**/*.css']))
        .pipe(autoprefixer(autoprefixOptions))
        .pipe(concat('libraries.css'))
        .pipe(minifyCss({ keepSpecialComments: false }))
        .pipe(rev())
        .pipe(gulp.dest(paths.destLibs));

    return merge(js, css);
};

// --------------- fonts & images ---------------
var flatten = require('gulp-flatten');

var copyImages = function() {
    return gulp.src(paths.srcImg).pipe(gulp.dest(paths.destImg));
};

var copyFonts = function() {
    return gulp.src(paths.srcFonts)
        .pipe(flatten())
        .pipe(gulp.dest(paths.destFonts));
};
