'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var contentful = require('contentful');
var twig = require('gulp-twig');
var browserSync = require('browser-sync').create();
var watch = require('gulp-watch');

gulp.task('stream', function () {
    // Endless stream mode
    return watch('./src/*.twig')
        .pipe(gulp.dest('data'));
});

// Global object to store returned data.
var entries = null;

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./www"
        }
    });
});


gulp.task('data', function(cb){
  var client;

  try {
    client = contentful.createClient({
      accessToken: '2e4752ec5edc713207f3367b623a8a2149606b385f0d5d68e1a35cf6ff54334c',
      space: 'ljlrqlrwqoub'
    });
  } catch(e) {
    console.error('Could not create Contenful client.', e);
  }

  client.getEntries({ 'content_type': 'page', include: 4}).then(function(entry) {
      gutil.log(entry)
      gulp.src('./src/index.twig')
        .pipe(twig({
            data: {
              title: 'test',
              page:  entry
            }
        }))
        .pipe(gulp.dest('./www/'));
  });

});

gulp.task('default', ['data'], function(){
  gutil.log(entries)
  gutil.log('Retrieved contenful entries.');
});
