// gulp require
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHTML = require('gulp-minify-html'),
	connect = require('gulp-connect');


// variable declaration 
var env,
	jsSources,
	sassSources,
	htmlSources,
	outputDir,
	sassStyle;


// sources
jsSources = ['components/scripts/myscript.js','components/scripts/bootstrap.js'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];


// environment variable
env = process.env.NODE_ENV || 'development';

if (env ==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded'
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed'
}; 


// Test
gulp.task('log', function() {

	gutil.log('workflows are awesome');

}); 


// JS 
gulp.task('js', function() {
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	.pipe(gulpif(env === 'production', uglify()))
	.on('error', gutil.log)
	.pipe(gulp.dest(outputDir +'js'))
	.pipe(connect.reload())
});


//SASS and Compass 
gulp.task('compass', function() {
	gulp.src(sassSources)
	.pipe(compass({
		sass: 'components/sass',
		image: outputDir + '/img',
		style: sassStyle
	}))
	.on('error', gutil.log)
	.pipe(gulp.dest(outputDir + 'css'))
	.pipe(connect.reload())
});

//HTML Livereload 
gulp.task('html', function() {
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env === 'production', minifyHTML()))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
	.pipe(connect.reload())
});


//Watch files for changes
gulp.task('watch', function() {
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('builds/development/*.html', ['html']);
});

//Live reload and web sever
gulp.task('connect', function() {
	connect.server({
		root: outputDir, 
		livereload: true
	});
});


//default GULP task
gulp.task('default', ['log', 'html', 'js', 'compass', 'connect', 'watch']);