var path = require('path');
var del = require('del');
var rename = require('rename');
var concat = require('concat');

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var gulpJsdoc2md = require('gulp-jsdoc-to-markdown');

var paths = {
	dist: 'dist/',
	build: 'build/',
	reports: 'reports/',
	doc: 'docs/'
	src: 'lib/skemer.js',
	tests: 'tests/*.js',
	jsdocmd: 'jsdoc.md'
};

gulp.task('clean', [], function() {
	del([
		path.join(paths.dist, '**'),
		path.join(paths.build, '**')
	], {force: true});
});

gulp.task('lint', function() {
	return gulp.src(paths.src)
			.pipe(jshint())
			.pipe(jshint.reporter('default'));
});

gulp.task('jasmine', ['lint'], function() {
	return gulp.src(paths.tests)
			.pipe(cover.instrument({
				pattern: 'lib/skemer.js'
			})
			.pipe(jasmine())
			.pipe(cover.gather())
			.pipe(cover.format())
			.pipe(gulp.dest(paths.reports));
});

gulp.task('jsdoc2md', function() {
	return gulp.src(paths.src)
			.pipe(concat(paths.jsdocmd))
			.pipe(gulpJsdoc2md())
			.on("error", function(err){
            gutil.log(gutil.colors.red("jsdoc2md failed"), err.message)
        })
        .pipe(rename(function(path){
            path.extname = ".md";
        }))
			.pipe(gulp.dest(paths.build));
});

gulp.task('watch', function() {
	gulp.watch([paths.src, paths.tests], ['jasmine']);
	gulp.watch(paths.src, ['jsdoc2md']);
});


gulp.task('one', ['jasmine', 'jsdoc2md']);

gulp.task('default', ['jasmine', 'jsdoc2md', 'watch']);

