var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');



gulp.task('compile:parent', function () {
	var tsconfig = typescript.createProject('tsconfig.json');
	var tsResult = gulp.src('src/reactive.iframes.parent.ts')
		.pipe(sourcemaps.init())
		.pipe(typescript(tsconfig));

	return tsResult.js
		.pipe(concat('reactive.iframes.parent.js'))
		.pipe(sourcemaps.write('./')) 
		.pipe(gulp.dest('dist'));
});


gulp.task('compile:child', function () {
	var tsconfig = typescript.createProject('tsconfig.json');
	var tsResult = gulp.src('src/reactive.iframes.child.ts')
		.pipe(sourcemaps.init())
		.pipe(typescript(tsconfig));

	return tsResult.js
		.pipe(concat('reactive.iframes.child.js'))
		.pipe(sourcemaps.write('./')) 
		.pipe(gulp.dest('dist'));
});

gulp.task('minify', ['compile'], function () {
    return gulp.src(['dist/*.js', '!dist/*.min.js'])
      .pipe(uglify())
      .pipe(rename({
          suffix: '.min'
      }))
      .pipe(gulp.dest('dist'));
});

gulp.task('compile', ['compile:parent', 'compile:child']);

gulp.task('default', ['compile', 'minify']);