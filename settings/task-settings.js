var clientSrcRoot = 'client';
var serverSrcRoot = 'server';
var modelsSrcRoot = 'models';
var buildRoot = 'dist';
var clientBuildRoot = buildRoot + '/wwwroot';
var clientBuildLibs = clientBuildRoot + '/libs/**';

module.exports = {
    autoprefixer: { browsers: ['> 2%', 'IE 10'] },
    bowerOrder: ['**jquery.js', '**jquery**', '**lodash**', '**angular.js', '**/showdown.js'],
    highlightLanguages: 'xml javascript typescript less css cs cpp yaml haskell x86asm json sql bash',
    paths: {
        client: {
            tsConfig: clientSrcRoot + '/tsconfig.json',
            tsTypingsConfig: clientSrcRoot + '/typings.json',
            tsTypings: [clientSrcRoot + '/typings/**/*.d.ts', modelsSrcRoot + '/**/*.d.ts'],

            src: clientSrcRoot,
            srcIndex: clientSrcRoot + '/index.html',
            srcHtml: [clientSrcRoot + '/**/*.html', '!' + clientSrcRoot + '/index.html', '!' + clientSrcRoot + '/critical/**/*'],
            srcLess: [clientSrcRoot + '/**/*.less', '!' + clientSrcRoot + '/critical/**/*'],
            srcTs: [clientSrcRoot + '/**/*.ts', '!' + clientSrcRoot + '/critical/**/*'],
            srcFonts: ['./bower_components/bootstrap/dist/fonts/*.*'],
            srcIcons: [clientSrcRoot + '/images/icons/*.svg'],
            srcIconsTemplate: [clientSrcRoot + '/styles/icons-template.templ'],
            srcImg: [clientSrcRoot + '/images/**/*.{png,jpg,gif,svg}', '!' + clientSrcRoot + '/images/icons/*.svg'],
            srcFavicons: [clientSrcRoot + '/favicon.ico', clientSrcRoot + '/favicons/**/*'],
            srcCriticalHtml: [clientSrcRoot + '/critical/critical.html'],
            srcCriticalLess: [clientSrcRoot + '/critical/critical.less'],
            srcCriticalImages: [clientSrcRoot + '/images/intro.jpg'],

            dest: clientBuildRoot,
            destFonts: clientBuildRoot + '/fonts',
            destIconsTemplate: clientBuildRoot + '/styles/icons-template.css',
            destImg: clientBuildRoot + '/images',
            destLibs: clientBuildRoot + '/libs',

            builtIndex: clientBuildRoot + '/index.html',
            builtCssAndJs: [clientBuildRoot + '/**/*.{css,js}'],
            builtCssNoLibs: [clientBuildRoot + '/**/*.css', '!' + clientBuildLibs + '/*.css'],
            builtJsNoLibs: [clientBuildRoot + '/**/*.js', '!' + clientBuildLibs + '/*.js']
        },
        server: {
            tsConfig: serverSrcRoot + '/tsconfig.json',
            tsTypingsConfig: serverSrcRoot + '/typings.json',
            tsTypings: [serverSrcRoot + '/typings/**/*.d.ts', modelsSrcRoot + '/**/*.d.ts'],

            srcRoot: serverSrcRoot,
            srcTs: [serverSrcRoot + '/**/*.ts'],
            srcOther: [
                'settings/.env',
                serverSrcRoot + '/**/*',
                '!' + serverSrcRoot + '/**/*.ts',
                '!' + serverSrcRoot + '/typings/**/*',
                '!' + serverSrcRoot + '/[tsconfig,typings].json'],

            dest: buildRoot
        }
    }
};