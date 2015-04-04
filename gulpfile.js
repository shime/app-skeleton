var gulp = require('gulp'),
    $ = require("gulp-load-plugins")();

gulp.task("style", function () {
  return gulp.src("public/style/**/*.scss")
    .pipe($.sass({
      outputStyle: "nested", // libsass doesn"t support expanded yet
      precision: 10,
      includePaths: ["."],
      onError: console.error.bind(console, "Sass error:")
    }))
    .pipe($.postcss([
      require("autoprefixer-core")({browsers: ["last 2 versions", "> 5%"]})
    ]))
    .pipe($.flatten())
    .pipe(gulp.dest("public/dist/styles"));
});

gulp.task('lint', function() {
  gulp.src(['./**/*.js', '!./node_modules/**', '!./dist/**', '!./public/vendor/**'])
  .pipe($.jshint())
  .pipe($.jshint.reporter('default'));
});

gulp.task('browserify', function() {
  gulp.src(['./public/javascripts/main.js'])
  .pipe($.browserify({
    insertGlobals: true,
    debug: true
  }))
  .on('error', swallowError)
  .pipe($.concat('bundle.js'))
  .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', ['browserify', 'lint', 'style'], function() {
  gulp.watch(['./**/*.js', '!./node_modules/**', '!./dist/**', '!./public/vendor/**'], [
    'lint'
  ]);

  gulp.watch(['./public/js/**/*.js'], ['browserify']);
  gulp.watch(['./public/style/**/*.scss'], ['style']);
});

function swallowError(err){
  console.log(err.toString())
  this.emit('end')
}
