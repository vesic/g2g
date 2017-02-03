var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var open = require('open');
var runSequence = require('run-sequence');
var wiredep = require('wiredep').stream;
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var babel = require('gulp-babel');

var config = {
  app: 'app'
};

gulp.task('bower', function () {
  gulp.src('app/index.html')
    .pipe(wiredep({
      directory: 'bower_components',
      ignorePath: '..'
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'));
});

gulp.task('lint', function() {
  return gulp.src(['app/lib/*.js', 'Gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', ['lint'], function() {
  return gulp.src(['app/lib/*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('app/js'));
});

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
  );
});

gulp.task('reload:html', function () {
  return gulp.src('app/*.html')
    .pipe(connect.reload());
});

gulp.task('reload:styles', function () {
  return gulp.src('app/css/*.css')
    .pipe(connect.reload());
});

gulp.task('reload:sass', function () {
  return gulp.src('app/sass/**/*.scss')
    .pipe(connect.reload());
});

gulp.task('reload:scripts', function () {
  return gulp.src('app/lib/**/*.js')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['app/*.html'], ['reload:html']);
  gulp.watch(['app/css/*.css'], ['reload:styles']);
  gulp.watch(['app/sass/**/*.scss'], ['sass', 'reload:sass']);
  gulp.watch(['app/lib/**/*.js'], ['scripts', 'reload:scripts']);
  gulp.watch(['Gulpfile.js'], ['lint']);
});

gulp.task('default', function() {
  console.log('hello');
})
