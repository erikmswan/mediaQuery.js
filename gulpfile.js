// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cache = require('gulp-cached');


// JSHint task
gulp.task('jshint', function() {
  gulp.src('./src/*.js')
    .pipe(cache('linting'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src('./src/mediaQuery.js')
    .pipe(rename('mediaQuery.debug.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(stripDebug())
    .pipe(rename('mediaQuery.noDebug.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('mediaQuery.min.js'))
    .pipe(gulp.dest('./dist/'));
});

// default task
gulp.task('default', ['scripts']);

// Watch task
gulp.task('watch', function() {
  gulp.watch('./src/*.js', ['jshint', 'scripts']);
});
