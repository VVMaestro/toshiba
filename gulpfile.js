var gulp = require('gulp'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  less = require('gulp-less'),
  rename = require("gulp-rename"),
  imagemin = require('gulp-imagemin'),
  plumber = require('gulp-plumber'),
  postHtml = require('gulp-posthtml')
  include = require('posthtml-include');


var paths = {
  dirs: {
    build: './build'
  },
  html: {
    source: './source/pages/*.html',
    dest: './build',
    watch: ['./source/pages/*.html', './source/blocks/**/*.html']
  },
  css: {
    source: './source/less/style.less',
    dest: './build/css',
    watch: ['./source/blocks/**/*.less', './source/less/**/*.less', './source/less/*.less']
  },
  images: {
    source: './source/**/images/*',
    dest: './build/img',
    watch: ['./source/**/img/*']
  },
  fonts: {
    source: './source/fonts/*',
    dest: './build/fonts',
    watch: './source/fonts/*'
  }
};

gulp.task('clean', function () {
  return del(paths.dirs.build);
});

gulp.task('html', function () {
  return gulp.src(paths.html.source)
    .pipe(plumber())
    .pipe(postHtml([
      include()
    ]))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('styles', function () {
  return gulp.src(paths.css.source)
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 10 versions']
    }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('images', function () {
  return gulp.src(paths.images.source)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(rename({
      dirname: ''
    }))
    .pipe(gulp.dest(paths.images.dest));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts.source)
    .pipe(plumber())
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: paths.dirs.build
    },
    reloadOnRestart: true
  });
  gulp.watch(paths.html.watch, gulp.parallel('html'));
  gulp.watch(paths.css.watch, gulp.parallel('styles'));
  gulp.watch(paths.images.watch, gulp.parallel('images'));
  gulp.watch(paths.fonts.watch, gulp.parallel('fonts'));
});


gulp.task('build', gulp.series(
  'clean',
  'html',
  'styles',
  'images',
  'fonts'
));

gulp.task('dev', gulp.series(
  'build',
  'server'
));