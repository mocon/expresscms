var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserify = require('gulp-browserify'),
  concat = require('gulp-concat'),
  embedlr = require('gulp-embedlr'),
  refresh = require('gulp-livereload'),
  lrserver = require('tiny-lr')(),
  express = require('express'),
  livereload = require('connect-livereload')
  livereloadport = 35729,
  serverport = 3000,
  jade = require('gulp-jade');

//We only configure the server here and start it only when running the watch task
var server = express();
//Add livereload middleware before static-middleware
server.use(livereload({
  port: livereloadport
}));
server.use(express.static('./public'));

//Task for sass using libsass through gulp-sass
gulp.task('sass', function(){
  gulp.src('sass/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('public'))
    .pipe(refresh(lrserver));
});

//Task for processing js with browserify
gulp.task('browserify', function(){
  gulp.src('js/*.js')
   .pipe(browserify())
   .pipe(concat('bundle.js'))
   .pipe(gulp.dest('public'))
   .pipe(refresh(lrserver));

});

//Task for moving jade-files to the build-dir
//added as a convenience to make sure this gulpfile works without much modification
gulp.task('jade', function(){
  gulp.src('views/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('public'))
    .pipe(refresh(lrserver));
});

//Convenience task for running a one-off build
gulp.task('public', ['jade', 'browserify', 'sass']);

gulp.task('serve', function() {
  //Set up your static fileserver, which serves files in the build dir
  server.listen(serverport);

  //Set up your livereload server
  lrserver.listen(livereloadport);
});

gulp.task('watch', function() {

  //Add watching on sass-files
  gulp.watch('sass/*.sass', ['sass']);
  
  //Add watching on js-files
  gulp.watch('js/*.js', ['browserify']);

  //Add watching on jade-files
  gulp.watch('views/*.jade', ['jade']);
});

gulp.task('default', ['public', 'serve', 'watch']);