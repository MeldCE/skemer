var path = require('path');
var del = require('del');
var rename = require('rename');
var packageInfo = require('./package.json');

var gulp = require('gulp');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine');
var documentation = require('gulp-documentation');
var concat = require('gulp-concat');
var checkDeps = require('gulp-check-deps');
var replace = require('gulp-replace');
var istanbul = require('gulp-istanbul');
var stripDebug = require('gulp-strip-debug');
var coveralls = require('gulp-coveralls');
var foreach = require('gulp-foreach');
var rename = require('gulp-rename');
var include = require('gulp-include');

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
	'no-var': 0, // TODO 1,
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
	dist: './',
	build: 'build/',
	reports: 'reports/',
	docs: 'docs/',
	src: 'src/lib/**/*.js',
	srcTests: 'src/spec/**/*.spec.js',
	srcJasmineJson: 'src/spec/support/jasmine.json',
	tests: 'spec/**/*.spec.js',
	lcov: 'coverage/lcov.info',
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

gulp.task('pre-test', ['lint', 'test-lint'], function() {
	return gulp.src(paths.src)
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire())
    // Write the covered files to a temporary directory
    .pipe(gulp.dest('test-tmp/'));
});

gulp.task('jasmine', ['lint', 'test-lint', 'pre-test'], function() {
	return gulp.src(paths.srcTests)
			.pipe(jasmine())
			.pipe(istanbul.writeReports());
});

gulp.task('jasmine:production', ['copy', 'jasmine'], function() {
	return gulp.src(paths.tests)
			.pipe(jasmine())
			.pipe(istanbul.writeReports())
			.pipe(istanbul.enforceThresholds({ thresholds: { global: 100 } }));
});

gulp.task('coveralls', ['jasmine:production'], function() {
	return gulp.src(paths.lcov)
  			.pipe(coveralls());
});

gulp.task('docs', ['htmldocs', 'mddocs']);

gulp.task('htmldocs', ['lint'], function() {
	return gulp.src(paths.src)
			.pipe(documentation({ format: 'html' }))
			.pipe(gulp.dest(paths.docs));
});

gulp.task('mddocs', ['lint'], function() {
	return gulp.src(paths.src)
			.pipe(foreach(function(stream, file) {
				return stream
						.pipe(documentation({ format: 'md', shallow: true }))
						.pipe(replace(/^#/gm, '##'))
						.pipe(concat(file.relative + '.md'));
						//.pipe(rename({
						//	basename: file.name,
						//	extname: '.md'
						//}));
			}))
			//.pipe(concat(paths.mddoc))
			.pipe(gulp.dest(paths.build));
});

/*gulp.task('mddocs', ['lint'], function() {
	return gulp.src(paths.src)
			.pipe(documentation({ format: 'md' }))
			//.pipe(concat(paths.mddoc))
			.pipe(gulp.dest(paths.build));
});*/

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
			.pipe(include())
			.pipe(gulp.dest('./'));
});

gulp.task('copy', ['jasmine', 'copy:jasmine.json'], function() {
	return gulp.src([paths.src, paths.srcTests], { base: 'src' })
		.pipe(stripDebug())
		.pipe(gulp.dest(paths.dist));
});

gulp.task('copy:jasmine.json', ['jasmine'], function() {
	return gulp.src(paths.srcJasmineJson, { base: 'src' })
		.pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function() {
	gulp.watch([paths.src, paths.srcTests], ['jasmine']);
	gulp.watch(paths.src, ['lint']);
	gulp.watch(paths.srcTests, ['test-lint']);
	gulp.watch(['src/README.md', paths.src], ['readme']);
	gulp.watch(paths.src, ['docs']);
	gulp.watch('package.json', ['check:deps']);
});

defaultTasks = ['check:deps', 'jasmine', 'docs', 'readme'];

gulp.task('one', defaultTasks);

gulp.task('default', defaultTasks.concat(['watch']));

gulp.task('production', defaultTasks.concat(['copy', 'jasmine:production', 'coveralls']));
