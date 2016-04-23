var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var htmlreplace = require('gulp-html-replace');
var hash = require('gulp-hash');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('build-clean', function() {
  return del(['dist', 'example']);
});

gulp.task('build-html', function() {
  var cssMap = gulp.src('./dist/assets.json');
  var useMap = {};

  for (var k in cssMap) {
    useMap[k.split('.')[0]] = '../dist/' + cssMap[k];
  }

  console.log(useMap);

  gulp.src('html/*.html')
    .pipe(htmlreplace(useMap))
    .pipe(gulp.dest('example/'));
});

gulp.task('build-css', function() {
  gulp.src('css/*.css')
    .pipe(cleanCSS())
    .pipe(hash())
    .pipe(gulp.dest('dist'))
    .pipe(hash.manifest('assets.json'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function() {
  return runSequence('build-clean', 'build-css', 'build-html');
});

gulp.task('default', ['build']);