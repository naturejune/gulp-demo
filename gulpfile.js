var gulp = require('gulp');
var del = require('del');
var jeditor = require("gulp-json-editor");
var runSequence = require('run-sequence');

var hash = require('gulp-hash');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var htmlreplace = require('gulp-html-replace');

var config = require('./config/config.json');

gulp.task('build-clean', function() {
  return del(['dist', 'example']);
});

gulp.task('build-css', function() {
  return gulp.src('css/*.css')
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(hash({
      template: '<%= hash %>-<%= name %><%= ext %>'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(hash.manifest('manifest.json'))
    .pipe(gulp.dest('dist'));
});

gulp.task('manifest-dev', function() {
  return gulp.src('dist/manifest.json')
    .pipe(jeditor(function(json) {
      var dev = {};
      Object.keys(json).forEach(function(name) {
        dev[name.split('.')[0]] = config.devPath + json[name];
      })
      return dev;
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('manifest-prod', function() {
  return gulp.src('dist/manifest.json')
    .pipe(jeditor(function(json) {
      var dev = {};
      Object.keys(json).forEach(function(name) {
        dev[name.split('.')[0]] = config.prodPath + json[name];
      })
      return dev;
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('build-html', function() {
  return gulp.src('html/*.html')
    .pipe(htmlreplace(require('./dist/manifest.json')))
    .pipe(gulp.dest('example'));
});


gulp.task('dev', function() {
  return runSequence(
      'build-clean',
      'build-css',
      'manifest-dev',
      'build-html'
    );
});

gulp.task('prod', function() {
  return runSequence(
      'build-clean',
      'build-css',
      'manifest-prod',
      'build-html'
    );
});

gulp.task('default', ['dev', 'watch']);

gulp.task('watch', function() {
  gulp.watch(['css/*.css', 'html/*.html'], ['dev'])
});
