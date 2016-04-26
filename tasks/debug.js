var gulp = require('gulp');
var livereload = require('gulp-livereload');

gulp.task('build:debug', ['client:debug:watch', 'server:debug:watch'], () => {
    livereload.listen();
});