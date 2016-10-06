var gulp = require('gulp');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var del = require('del');
var merge = require('event-stream').merge;
var path = require('path');
var plumber = require('gulp-plumber');
var through = require('through2');
var uglify = require('gulp-uglify');
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
var inject = require('gulp-inject');
var revAll = require('gulp-rev-all');
var runSequence = require('run-sequence').use(gulp);
var typings = require('gulp-typings');

gulp.task('client:release:clean', () => del([paths.dest]));

gulp.task('client:release:build', ['client:release:clean'], () => {
    var templates = compileTemplates();
    var styles = compileStyles();
    var scripts = compileScripts();
    var libraries = compileLibs(scripts);
    var images = copyImages();
    var fonts = copyFonts();
    var favicons = copyFavicons();

    var iconStyles = through.obj();
    var icons = compileIcons(iconStyles);

    var allStyles = styles //merge(styles, iconStyles)
        .pipe(concat('styles.css'))
        .pipe(cleanCss());

    var index = gulp.src(paths.srcIndex)
        .pipe(plumber(plumberOptions))
        .pipe(gulp.dest(paths.dest))
        .pipe(inject(libraries, { name: 'bower', relative: true }))
        .pipe(inject(merge(allStyles, scripts), { relative: true }))
        .pipe(inject(templates, { name: 'templates', relative: true }))
        .pipe(gulp.dest(paths.dest));

    var revFiles = merge(templates, scripts, libraries, images, allStyles, index)
        .pipe(through.obj((file, enc, cb) => {
            // change each files base path to be relative to the output dir (paths.dest)
            var basePath = path.resolve(process.cwd(), paths.dest);
            var writePath = path.resolve(basePath, file.relative);

            file.base = path.normalize(basePath + path.sep);
            file.path = writePath;

            cb(null, file);
        }))
        .pipe(revAll.revision({
            dontRenameFile: [/^\/?index.html$/g],
            dontSearchFile: [/.js$/g],
            includeFilesInManifest: ['.css', '.js', '.png', '.jpg', '.svg', '.gif']
        }))
        .pipe(gulp.dest(paths.dest))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(paths.dest));

    return merge(revFiles, fonts, favicons, icons);
});


// ------------------------------------------- templates -------------------------------------------
var angularTemplateCache = require('gulp-angular-templatecache');

var compileTemplates = () =>
    gulp.src(paths.srcHtml)
        .pipe(plumber(plumberOptions))
        .pipe(angularTemplateCache('templates.js', { module: 'mj.templates' }))
        .pipe(uglify());


// -------------------------------------------- styles ---------------------------------------------
var less = require('gulp-less');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var progeny = require('gulp-progeny');
var lessAutoprefix = new lessPluginAutoprefix(settings.autoprefixer);

var compileStyles = () =>
    gulp.src(paths.srcLess.concat('!**/*.debug.less'))
        .pipe(plumber(plumberOptions))
        .pipe(progeny())
        .pipe(less({ plugins: [lessAutoprefix] }));


// -------------------------------------------- scripts --------------------------------------------
var angularFilesort = require('gulp-angular-filesort');
var order = require('gulp-order');
var ts = require('gulp-typescript');
var tsProject = ts.createProject(paths.tsConfig, { sortOutput: true });

var compileScripts = () =>
    gulp.src(paths.tsTypings.concat(paths.srcTs))
        .pipe(plumber(plumberOptions))
        .pipe(ts(tsProject))
        .js
        .pipe(angularFilesort())
        .pipe(concat('scripts.js'))
        .pipe(uglify());


// --------------------------------------------- libs ----------------------------------------------
var autoprefixer = require('gulp-autoprefixer');
var bowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var ignore = require('gulp-ignore');
var modernizr = require('gulp-modernizr');
//var replace = require('gulp-replace');

var compileLibs = (scripts) => {
    var modernizrLib = scripts
        .pipe(modernizr({
            tests: ['smil'],
            options: ['setClasses']
        }));

    var js = merge(gulp.src(bowerFiles()), modernizrLib)
        .pipe(plumber(plumberOptions))
        .pipe(filter(['**/*.js']))
        .pipe(ignore.exclude(['**/*.map']))
        .pipe(order(settings.bowerOrder))
        //.pipe(replace(/^\/\/# sourceMappingURL=.+$/g, ''))
        .pipe(concat('libraries.js'))
        .pipe(uglify());

    var css = gulp.src(bowerFiles())
        .pipe(plumber(plumberOptions))
        .pipe(filter(['**/*.css']))
        .pipe(autoprefixer(settings.autoprefixer))
        .pipe(concat('libraries.css'))
        .pipe(cleanCss());

    return merge(js, css);
};


// ---------------------------------------- fonts & images -----------------------------------------
var flatten = require('gulp-flatten');

var copyImages = () =>
    gulp.src(paths.srcImg, { base: paths.src })
        .pipe(plumber(plumberOptions));

var copyFonts = () =>
    gulp.src(paths.srcFonts)
        .pipe(plumber(plumberOptions))
        .pipe(flatten())
        .pipe(gulp.dest(paths.destFonts));

var copyFavicons = () =>
    gulp.src(paths.srcFavicons)
        .pipe(plumber(plumberOptions))
        .pipe(gulp.dest(paths.destFavicons));


// --------------------------------------------- icons ---------------------------------------------
var consolidate = require('gulp-consolidate');
var iconfont = require('gulp-iconfont');
var rename = require("gulp-rename");

var compileIcons = (stylesStream) =>
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
                    appendUnicode: true,
                    fontName: 'mj-icons',
                    fontPath: paths.destFonts.substr(paths.dest.length+1)
                }))
                .pipe(rename(paths.destIconsTemplate))
                .pipe(stylesStream);
        })
        .pipe(gulp.dest(paths.destFonts));