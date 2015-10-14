var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserify = require('gulp-browserify'),
  concat = require('gulp-concat'),
  embedlr = require('gulp-embedlr'),
  refresh = require('gulp-livereload'),
  tinylr = require('tiny-lr'),
  lrserver = tinylr(),
  express = require('express'),
  livereload = require('connect-livereload'),
  body = require('body-parser'),
  livereloadport = 35729,
  serverport = 3000,
  jade = require('gulp-jade');

var server = express();
server
  .use(express.static('./public'));

//Task for sass using libsass through gulp-sass
gulp.task('sass', function(){
  gulp.src('sass/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(refresh());
});

//Task for processing js with browserify
gulp.task('browserify', function(){
  gulp.src('js/*.js')
   .pipe(browserify())
   .pipe(concat('bundle.js'))
   .pipe(gulp.dest('public'))
   .pipe(refresh());

});

//Task for moving jade-files to the build-dir
//added as a convenience to make sure this gulpfile works without much modification
gulp.task('jade', function(){
  gulp.src('views/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('public'))
    .pipe(refresh());
});

//Convenience task for running a one-off build
gulp.task('public', ['jade', 'browserify', 'sass']);

gulp.task('serve', function() {
  //Set up your static fileserver, which serves files in the build dir
  server.listen(serverport, function() {
    console.log('Express is listening on: %s...', serverport);
  });
});

gulp.task('watch', function() {
  refresh.listen();

  //Add watching on sass-files
  gulp.watch('sass/*.sass', ['sass']);
  
  //Add watching on js-files
  gulp.watch('js/*.js', ['browserify']);

  //Add watching on jade-files
  gulp.watch('views/*.jade', ['jade']);
});

gulp.task('default', ['public', 'serve', 'watch']);