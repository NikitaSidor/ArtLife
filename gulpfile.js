const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass')),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify-es').default,
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({ outputStyle: 'expanded' })) //expanded/compressed
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(concat('style.min.css'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src(['app/js/**/*.js', '!app/js/main.min.js'])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.streame())
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/*.html']).on('change', browserSync.reload);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
}

function cleanBuild() {
    return del('dist');
}


function build() {
	    return src([
		                'app/*.html',
		                'app/css/style.min.css',
		                'app/js/main.min.js',
		                'app/img/**/*',
		                'app/fonts/**/*'
		            ], { base: 'app' })
	        .pipe(dest('dist'))
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.cleanBuild = cleanBuild

exports.build = series(cleanBuild, build);
exports.default = parallel(browsersync, watching);
