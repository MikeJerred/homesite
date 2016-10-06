var clientSrcRoot = 'client';
var serverSrcRoot = 'server';
var modelsSrcRoot = 'models';
var buildRoot = 'dist';
var clientBuildRoot = buildRoot + '/wwwroot';
var clientBuildLibs = clientBuildRoot + '/libs/**';

module.exports = {
    autoprefixer: { browsers: ['> 2%', 'IE 10'] },
    bowerOrder: ['**jquery.js', '**jquery**', '**lodash**', '**angular.js', '**/showdown.js'],
    paths: {
        client: {
            tsConfig: clientSrcRoot + '/tsconfig.json',
            tsTypingsConfig: clientSrcRoot + '/typings.json',
            tsTypings: [clientSrcRoot + '/typings/**/*.d.ts', modelsSrcRoot + '/**/*.d.ts'],

            src: clientSrcRoot,
            srcIndex: clientSrcRoot + '/index.html',
            srcHtml: [clientSrcRoot + '/**/*.html', '!' + clientSrcRoot + '/index.html'],
            srcLess: [clientSrcRoot + '/**/*.less'],
            srcTs: [clientSrcRoot + '/**/*.ts'],
            srcFonts: ['./bower_components/bootstrap/dist/fonts/*.*'],
            srcIcons: [clientSrcRoot + '/images/icons/*.svg'],
            srcIconsTemplate: [clientSrcRoot + '/styles/icons-template.templ'],
            srcImg: [clientSrcRoot + '/images/**/*.{png,jpg,gif,svg}', '!' + clientSrcRoot + '/images/icons/*.svg'],
            srcFavicons: clientSrcRoot + '/favicons/**/*',

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