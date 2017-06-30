var gulp = require('gulp')
var watch = require('gulp-watch')
var babel = require('gulp-babel')
// var tsc = require('typescript')

var paths = {
     jsx: ['src/**/*.jsx'],
     js: ['src/**/*.js'],
     css: ['src/**/*.css'],
     dist: 'dist/',
    };

gulp.task('default', function(){

    gulp.src(paths.js)
    .pipe(watch(paths.js))
    .pipe(babel({
        presets: ['react', 'es2015', 'stage-0']
    }))
    .pipe(gulp.dest(paths.dist));

    gulp.src(paths.css)
    .pipe(watch(paths.css))
    .pipe(gulp.dest(paths.dist));

});
