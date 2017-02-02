var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var open = require('open');
var runSequence = require('run-sequence');

var config = {
  app: 'app'
}

gulp.task('start:server', function() {
  connect.server({
    root: config.app,
    livereload: true,
    port: 9000
  });
});

gulp.task('start:client', ['start:server'], function () {
  open('http://localhost:9000');
});

gulp.task('serve', function(cb) {
  runSequence(
    'start:client',
    'watch',
    cb
  )
  // open('http://localhost:9000')
})

gulp.task('html', function () {
  return gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('default', function() {
  console.log('hello');
})
