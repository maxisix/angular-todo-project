/*******************************************************************************
DEPENDENCIES
*******************************************************************************/

var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	notify = require('gulp-notify'),
	stylish = require('jshint-stylish'),
	imagemin = require('gulp-imagemin'),
	plumber = require('gulp-plumber'),
	gcmq = require('gulp-group-css-media-queries'),
	svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	browserify = require('gulp-browserify');




/*******************************************************************************
FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/

var root_paths = {

	app : './app/',

	assets : './assets/'

};


var target = {

	main_sass_src : root_paths.assets + 'sass/styles.scss',
    sass_src : root_paths.assets + 'sass/**/*.scss',                  // all sass files
    css_dest : root_paths.assets + 'css',                          // where to put minified css

    js_src : root_paths.assets + 'js/*.js',						// all js files
    js_dest : root_paths.assets + 'js/min',                        // where to put minified js

	img_src : root_paths.assets + 'images/*.{png,jpg,gif}',		// all img files
	img_dest : root_paths.assets + 'images/min',					// where to put minified img

	svg_src : root_paths.assets + 'images/svg/*.svg',
	svg_dest : root_paths.assets,

	angularjs_main_src : root_paths.app + 'app.module.js',
	angularjs_src : root_paths.app + '**/*.js',
	angularjs_dest : root_paths.app

};





/*******************************************************************************
SASS TASK
*******************************************************************************/

gulp.task('styles', function() {
	return gulp.src(target.main_sass_src)
		.pipe(plumber())
		.pipe(sass({
			noCache: true,
			style: 'compressed'
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gcmq())
		.pipe(gulp.dest(target.css_dest))
		.pipe(notify('Styles task completed'));
});






/*******************************************************************************
JS TASK
*******************************************************************************/

// gulp.task('scripts', function() {
// 	return gulp.src(target.angularjs_main_src)
// 		.pipe(plumber())
// 		// .pipe(jshint())
// 		// .pipe(jshint.reporter(stylish))
// 		.pipe(concat('scripts.min.js'))
// 		// .pipe(uglify())
// 		.pipe(gulp.dest(target.js_dest))
// 		.pipe(notify('Scripts task completed'));
// });





/*******************************************************************************
angularJS TASK
*******************************************************************************/

gulp.task('angularJS', function() {
	return gulp.src(target.angularjs_main_src)
		.pipe(browserify({
    		insertGlobals: true,
    		debug: true
  		}))
		.pipe(plumber())
		// .pipe(jshint())
		// .pipe(jshint.reporter(stylish))
		.pipe(concat('scripts.min.js'))
		// .pipe(uglify())
		.pipe(gulp.dest(target.angularjs_dest))
		.pipe(notify('angularJS task completed'));
});





/*******************************************************************************
IMAGES TASK
*******************************************************************************/

gulp.task('images', function() {
	return gulp.src(target.img_src)
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(notify('Images task completed'))
		.pipe(gulp.dest(target.img_dest));
});





/*******************************************************************************
SVGSTORE TASK
*******************************************************************************/

gulp.task('svgstore', function() {
	return gulp.src(target.svg_src)
        .pipe(svgmin())
        .pipe(svgstore({ fileName: 'svg-defs.svg', prefix: 'shape-', inlineSvg: false }))
        .pipe(gulp.dest(target.svg_dest));
});






/*******************************************************************************
DEFAULT TASK
*******************************************************************************/

gulp.task('default', ['styles','scripts','images'], function() {

});





/*******************************************************************************
WATCH TASK
*******************************************************************************/

gulp.task('watch', function() {

	gulp.watch(target.sass_src, ['styles']);		// Watch .scss files
	gulp.watch(target.angularjs_src, ['angularJS']);			// Watch .js files

});