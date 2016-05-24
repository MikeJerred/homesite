var gulp = require('gulp');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var del = require('del');
var merge = require('event-stream').merge;
var through2 = require('through2');
var uglify = require('gulp-uglify');

var settings = require('../../settings/task-settings.js');
var paths = settings.paths.client;


// --------------------------------------------- build ---------------------------------------------
var inject = require('gulp-inject');
var rev = require('gulp-rev');
var typings = require('gulp-typings');

gulp.task('client:release:clean', () => del([paths.dest]));

gulp.task('client:release:typings', () => gulp.src(paths.tsTypingsConfig).pipe(typings()));

gulp.task('client:release:build', ['client:release:clean', 'client:release:typings'], () => {
    var templates = compileTemplates();
    var styles = compileStyles();
    var scripts = compileScripts();
    var libraries = compileLibs();
    var images = copyImages();
    var fonts = copyFonts();

    var iconStyles = through2.obj();
    var icons = compileIcons(iconStyles);

    var allStyles = styles //merge(styles, iconStyles)
        .pipe(concat('styles.css'))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));

    var index = gulp.src(paths.srcIndex)
        .pipe(gulp.dest(paths.dest))
        .pipe(inject(libraries, { name: 'bower', relative: true }))
        .pipe(inject(merge(allStyles, scripts), { relative: true }))
        .pipe(inject(templates, { name: 'templates', relative: true }))
        .pipe(gulp.dest(paths.dest));

    return merge(templates, allStyles, scripts, libraries, images, fonts, icons, index);
});


// ------------------------------------------- templates -------------------------------------------
var angularTemplateCache = require('gulp-angular-templatecache');

var compileTemplates = () =>
    gulp.src(paths.srcHtml)
        .pipe(angularTemplateCache('templates.js', { module: 'mj.templates' }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));


// -------------------------------------------- styles ---------------------------------------------
var less = require('gulp-less');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var progeny = require('gulp-progeny');
var lessAutoprefix = new lessPluginAutoprefix(settings.autoprefixer);

var compileStyles = () =>
    gulp.src(paths.srcLess.concat('!**/*.debug.less'))
        .pipe(progeny())
        .pipe(less({ plugins: [lessAutoprefix] }));


// -------------------------------------------- scripts --------------------------------------------
var angularFilesort = require('gulp-angular-filesort');
var order = require('gulp-order');
var ts = require('gulp-typescript');
var tsProject = ts.createProject(paths.tsConfig, { sortOutput: true, target: 'es5' });

var compileScripts = () =>
    gulp.src(paths.tsTypings.concat(paths.srcTs))
        .pipe(ts(tsProject))
        .js
        .pipe(angularFilesort())
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(paths.dest));


// --------------------------------------------- libs ----------------------------------------------
var autoprefixer = require('gulp-autoprefixer');
var bowerFiles = require('main-bower-files');
var filter = require('gulp-filter');

var compileLibs = () => {
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

var copyImages = () =>
    gulp.src(paths.srcImg)
        .pipe(gulp.dest(paths.destImg));

var copyFonts = () =>
    gulp.src(paths.srcFonts)
        .pipe(flatten())
        .pipe(gulp.dest(paths.destFonts))


// --------------------------------------------- icons ---------------------------------------------
var consolidate = require('gulp-consolidate');
var iconfont = require('gulp-iconfont');
var rename = require("gulp-rename");

var compileIcons = (stylesStream) =>
    gulp.src(paths.srcIcons)
        .pipe(iconfont({
            fontName: 'mj-icons',
            formats: ['svg', 'ttf', 'eot', 'woff'],
            normalize: true,
            fontHeight: 1001
        }))
        .on('glyphs', (glyphs, options) => {
            gulp.src(paths.srcIconsTemplate)
                .pipe(consolidate('lodash', {
                    glyphs: glyphs,
                    appendUnicode: true,
                    fontName: 'mj-icons',
                    fontPath: paths.destFonts.substr(paths.dest.length+1)
                }))
                .pipe(rename(paths.destIconsTemplate))
                .pipe(stylesStream);
        })
        .pipe(gulp.dest(paths.destFonts));