var gulp = require('gulp');

var gulpLoadPlugins = require('gulp-load-plugins')({
	DEBUG: false,
	scope: ['dependencies'],
	pattern: ['autoprefixer', 'main-bower-files', 'browser-sync', 'gulp-*', 'gulp.*'],
	lazy: true,
	rename: {
		'gulp-sass': 'scss',
		'gulp-clean-css': 'cleanCSS',
	}
});
var minimist = require('minimist');
var envOptions = {
	string: 'env',
	default: {env: 'dev'}
};

var options = minimist(process.argv.slice(2), envOptions);
console.log(options)

var 
	src     = 'src/',
	dist    = 'dist/',
	images  = 'images/',
	scss    = 'scss/',
	css     = 'css/',
	js      = 'js/';

gulp.task('script', function () {
	gulp.src(src + js + '*.js')
	.pipe(gulpLoadPlugins.plumber())
	.pipe(gulpLoadPlugins.if(options.env === 'prod', gulpLoadPlugins.uglify()))
	.pipe(gulpLoadPlugins.sourcemaps.write('.'))
	.pipe(gulp.dest(dist + js))
	.pipe(gulpLoadPlugins.browserSync.reload({
		stream: true,
	}));
})

// gulp.task('scss', function () {
// 	var processors = [
// 		gulpLoadPlugins.autoprefixer({ browsers: ['last 3 version'] }),
// 	];
// 	gulp.src(src + scss + '**/*.scss')
// 		.pipe(gulpLoadPlugins.plumber())
// 		.pipe(gulpLoadPlugins.sourcemaps.init())
// 		.pipe(gulpLoadPlugins.if(
// 			options.env === 'en', gulpLoadPlugins.scss({
// 				includePaths: ['./src/scss/en']
// 			}).on('error', gulpLoadPlugins.scss.logError)
// 		))
// 		.pipe(gulpLoadPlugins.if(
// 			options.env === 'ja', gulpLoadPlugins.scss({
// 				includePaths: ['./src/scss/ja']
// 			}).on('error', gulpLoadPlugins.scss.logError)
// 		))
// 		.pipe(gulpLoadPlugins.scss().on('error', gulpLoadPlugins.scss.logError))
// 		.pipe(gulpLoadPlugins.postcss(processors))
// 		.pipe(gulpLoadPlugins.if(options.env === 'prod',gulpLoadPlugins.cleanCSS()))
// 		.pipe(gulpLoadPlugins.sourcemaps.write('.'))
// 		.pipe(gulp.dest(dist + css))
// 		.pipe(gulpLoadPlugins.browserSync.reload({
// 			stream: true,
// 		}));
// });

gulp.task('scss', function () {
	var processors = [
		gulpLoadPlugins.autoprefixer({ browsers: ['last 3 version'] }),
	];
	gulp.src(src + scss + '**/*.scss')
		.pipe(gulpLoadPlugins.plumber())
		.pipe(gulpLoadPlugins.sourcemaps.init())
		.pipe(
			gulpLoadPlugins.if(
				options.env === 'en', gulpLoadPlugins.scss({
					includePaths: ['./src/scss/en']
				}).on('error', gulpLoadPlugins.scss.logError)
			),
			gulpLoadPlugins.if(
				options.env === 'jp', gulpLoadPlugins.scss({
					includePaths: ['./src/scss/jp']
				}).on('error', gulpLoadPlugins.scss.logError)
			)
		)
		.pipe(gulpLoadPlugins.scss().on('error', gulpLoadPlugins.scss.logError))
		.pipe(gulpLoadPlugins.postcss(processors))
		.pipe(gulpLoadPlugins.if(options.env === 'prod', gulpLoadPlugins.cleanCSS()))
		.pipe(gulpLoadPlugins.sourcemaps.write('.'))
		.pipe(gulp.dest(dist + css))
		.pipe(gulpLoadPlugins.browserSync.reload({
			stream: true,
		}));
});

gulp.task('watch',function(){
	gulpLoadPlugins.browserSync.init({
		server: dist,
		open: false,
		port: 1234,
	});
	gulp.watch(src + scss+ '**/*.scss', ['scss']);
	gulp.watch(src + js + '**/*.js', ['script']);
});

gulp.task('default' ,['scss', 'watch']);