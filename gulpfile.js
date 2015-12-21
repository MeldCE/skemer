var path = require('path');
var del = require('del');
var rename = require('rename');
var packageInfo = require('./package.json');

var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine');
var documentation = require('gulp-documentation');
var concat = require('gulp-concat');
var cover = require('gulp-coverage');
var checkDeps = require('gulp-check-deps');
var replace = require('gulp-replace');

var eslintRules = {
	'comma-dangle': 2,
	'curly': 2,
	'no-caller': 2,
	'no-dupe-args': 2,
	'no-dupe-keys': 2,
	'no-duplicate-case': 2,
	'no-extra-semi': 1,
	'no-invalid-regexp': 2,
	'no-redeclare': 2,
	'no-shadow': 2,
	'no-unused-vars': 1,
	'no-undef': 2,
	'no-var': 1,
	"require-jsdoc": [2, {
		"require": {
			"FunctionDeclaration": true,
			"MethodDefinition": true,
			"ClassDeclaration": true
		}
	}],
	'no-warning-comments': 1,
	'semi': 2,
	'strict': 1,
	'valid-jsdoc': 1,
	'valid-typeof': 2
};

var paths = {
	dist: 'dist/',
	build: 'build/',
	reports: 'reports/',
	docs: 'docs/',
	mainSrc: 'src/lib/skemer.js',
	src: 'src/**/*.js',
	tests: 'test/**/*.js',
	mddoc: 'doc.md'
};

gulp.task('clean', [], function() {
	del([
		path.join(paths.dist, '**'),
		path.join(paths.build, '**')
	], {force: true});
});

gulp.task('check:deps', function() {
	return gulp.src('package.json')
			.pipe(checkDeps());
});

gulp.task('lint', function() {
	return gulp.src(paths.src)
			.pipe(eslint({
				'ecmaFeatures': {
					modules: true
				},
				rules: eslintRules,
				env: {
					node: true,
					es6: true
				}
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
});

gulp.task('test-lint', function() {
	return gulp.src(paths.tests)
			.pipe(eslint({
				'ecmaFeatures': {
					modules: true
				},
				rules: eslintRules,
				env: {
					node: true,
					es6: true,
					jasmine: true
				}
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
});

gulp.task('jasmine', ['lint', 'test-lint'], function() {
	return gulp.src(paths.tests)
			.pipe(jasmine());
});

gulp.task('coverage', ['lint', 'test-lint'], function() {
	return gulp.src(paths.tests, { read: false})
			.pipe(cover.instrument({
				pattern: paths.src,
				debugDirectory: 'debug'
			}))
			.pipe(jasmine())
			.pipe(cover.gather())
			.pipe(cover.format())
			.pipe(gulp.dest(paths.reports));
});

gulp.task('docs', ['htmldocs', 'mddocs']);

gulp.task('htmldocs', ['lint'], function() {
	return gulp.src(paths.src)
			.pipe(documentation({ format: 'html' }))
			.pipe(gulp.dest(paths.docs));
});

gulp.task('mddocs', ['lint'], function() {
	return gulp.src(paths.src)
			.pipe(documentation({ format: 'md' }))
			.pipe(concat(paths.mddoc))
			.pipe(gulp.dest(paths.build));
});

gulp.task('readme', ['mddocs'], function() {
	return gulp.src(['src/README.md', path.join(paths.build, paths.mddoc)])
			.pipe(concat('README.md'))
			.pipe(replace(/%%([a-zA-Z0-9-_.]+)%%/g, function(match, param) {
				if (packageInfo[param]) {
					return packageInfo[param];
				} else {
					return match;
				}
			}))
			.pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
	gulp.watch([paths.src, paths.tests], ['jasmine']);
	gulp.watch(paths.src, ['lint']);
	gulp.watch(paths.tests, ['test-lint']);
	gulp.watch(['src/README.md', paths.src], ['readme']);
	gulp.watch(paths.src, ['docs']);
	gulp.watch('package.json', ['check:deps']);
});

defaultTasks = ['check:deps', 'jasmine', 'docs', 'readme'];

gulp.task('one', defaultTasks);

gulp.task('default', defaultTasks.concat(['watch']));

