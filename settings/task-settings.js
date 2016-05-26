var clientSrcRoot = 'client';
var serverSrcRoot = 'server';
var modelsSrcRoot = 'models';
var buildRoot = 'dist';
var clientBuildRoot = buildRoot + '/wwwroot';
var clientBuildLibs = clientBuildRoot + '/libs/**';

module.exports = {
    autoprefixer: { browsers: ['> 2%', 'IE 10'] },
    bowerOrder: ['**jquery.js', '**jquery**', '**lodash**', '**angular.js'],
    paths: {
        client: {
            tsConfig: './tsconfig.json',
            tsTypings: ['./typings/browser.d.ts', './typings/browser/**/*.d.ts', modelsSrcRoot + '/**/*.d.ts'],
            tsTypingsConfig: './typings.json',

            srcIndex: clientSrcRoot + '/index.html',
            srcHtml: [clientSrcRoot + '/**/*.html', '!' + clientSrcRoot + '/index.html'],
            srcLess: [clientSrcRoot + '/**/*.less'],
            srcTs: [clientSrcRoot + '/**/*.ts'],
            srcFonts: ['./bower_components/bootstrap/dist/fonts/*.*'],
            srcIcons: [clientSrcRoot + '/images/icons/*.svg'],
            srcIconsTemplate: [clientSrcRoot + '/styles/icons-template.templ'],
            srcImg: [clientSrcRoot + '/images/**/*', '!' + clientSrcRoot + '/images/icons/*.svg'],

            dest: clientBuildRoot,
            destFonts: clientBuildRoot + '/fonts',
            destIconsTemplate: clientBuildRoot + '/styles/icons-template.css',
            destImg: clientBuildRoot + '/images',
            destLibs: clientBuildRoot + '/libs',

            builtCssAndJs: [clientBuildRoot + '/**/*.{css,js}'],
            builtCssNoLibs: [clientBuildRoot + '/**/*.css', '!' + clientBuildLibs + '/*.css'],
            builtJsNoLibs: [clientBuildRoot + '/**/*.js', '!' + clientBuildLibs + '/*.js']
        },
        server: {
            tsConfig: './tsconfig.json',
            tsTypings: ['./typings/main.d.ts', './typings/main/**/*.d.ts'],

            srcRoot: serverSrcRoot,
            srcTs: [serverSrcRoot + '/**/*.ts'],
            srcOther: [serverSrcRoot + '/**/*', '!' + serverSrcRoot + '/**/*.ts'],

            dest: buildRoot
        }
    }
};