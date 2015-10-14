var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    server = require('gulp-express'),
    lr = require('tiny-lr')();
 
gulp.task('default', function () {
  nodemon({
    script: 'bin/www',
    ext: 'jade js sass'
  })
  .on('restart', function () {
    console.log('Server restarted!');
  });
  
  lr.listen(35729);
  
  gulp.watch('server/**/*', function(){
    var fileName = require('path').relative('3000', event.path);
    lr.changed({
      body: {
        files: [fileName]
      }
    });
  });
});