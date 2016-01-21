// include gulp
var gulp = require('gulp'); 

// include plug-ins
var jshint = require('gulp-jshint'),
  stripDebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  rename = require('gulp-rename'),
  cache = require('gulp-cached');


// JSHint task
gulp.task('jshint', function() {
  gulp.src('./src/*.js')
    .pipe(cache('linting'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


// JSHint watch task
gulp.task('jsWatch', function() {

  // watch for JS changes
  gulp.watch('./src/*.js', ['jshint']);
});

// Browserify Bundling
gulp.task('browserify', function() {

  browserify('./src/mediaQuery.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'))
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src('./src/mediaQuery.js')
    .pipe(uglify())
    .pipe(stripDebug())
    .pipe(rename('mediaQuery.min.js'))
    .pipe(gulp.dest('./build/'));
});


// default task
gulp.task('default', ['browserify', 'scripts'], function() {});

