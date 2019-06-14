var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var rename = require('gulp-rename');

gulp.task('inject', function gulpTask() {
  return gulp.src('./socialEventPlanner/index-base.html')
    .pipe(inject(gulp.src(['./socialEventPlanner/app.module.js', './socialEventPlanner/**/*.js', './socialEventPlanner/**/*.css', '!./socialEventPlanner/bower_components/**/*', '!./socialEventPlanner/User/user.service.spec.js'], {read: false}), {relative: true}))
    .pipe(wiredep({devDependencies: true}))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./socialEventPlanner/'));
});

gulp.task('default', gulp.series('inject'));
