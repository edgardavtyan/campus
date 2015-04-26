var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');

gulp.task('sass', function() {
   gulp.src('sass/styles.scss')
      .pipe(sass({ errLogToConsole: true }))
      .pipe(autoprefixer())
      .pipe(gulp.dest('public'))
      .pipe(livereload());
});

gulp.task('default', ['sass']);

gulp.task('watch', function() {
   livereload.listen();
   gulp.watch(['sass/**/*.scss'], ['sass']);
});
