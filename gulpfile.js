'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var contentful = require('contentful');
var twig = require('gulp-twig');
var browserSync = require('browser-sync').create();
var watch = require('gulp-watch');

// Global object to store returned data.
var entries = null;

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./www"
        }
    });
});


gulp.task('data', function (cb) {
    var client;
    try {
        client = contentful.createClient({
            accessToken: '2e4752ec5edc713207f3367b623a8a2149606b385f0d5d68e1a35cf6ff54334c',
            space: 'ljlrqlrwqoub'
        });
        return client.getEntries({'content_type': 'page', include: 4}).then(function (entry) {
            return gulp.src('./src/index.twig')
                .pipe(twig({
                    data: {
                        title: 'test',
                        page: entry
                    }
                }))
                .pipe(gulp.dest('./www/'));
        });
    } catch (e) {
        console.error('Could not create Contenful client.', e);
    }
    return true;
});

gulp.task('default', ['watch'], function () {

});


gulp.task('watch', function () {
    var watcher = gulp.watch('src/*.twig', ['data']);
    watcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
