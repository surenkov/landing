/// <binding Clean='clean' ProjectOpened='run' />
var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();

var path = {
    sass: ['./landing/**/*.scss'],
    frontJs: ['./landing/static/**/*.js', './landing/blocks/**/dist/**/*.js'],
    managerJs: ['./landing/manager/static/**/*.js', './landing/blocks/*/*.js'],
    static: ['./landing/**/static/dist/**/*.*'],
    dest: './static'
};

var sassIncludes = [
    './static/dist/foundation-sites/scss',
    './static/dist/motion-ui/src'
];

function bundleJs(jsPath, outPath) {
    return function () {
        return gulp.src(jsPath)
            .pipe($.sourcemaps.init())
            .pipe($.concat('bundle.js'))
            .pipe(gulp.dest(outPath))
            .pipe($.uglify({ preserveComments: 'license' }))
            .pipe($.rename({ extname: '.min.js' }))
            .pipe($.sourcemaps.write('maps'))
            .pipe(gulp.dest(outPath));
    }
}

gulp.task('js:front', bundleJs(path.frontJs, path.dest + '/js/landing'));

gulp.task('js:manager', bundleJs(path.managerJs, path.dest + '/js/manager'));

gulp.task('sass', function () {
    return gulp.src(path.sass)
        // Sass
        .pipe($.sass({ includePaths: sassIncludes, sourcemap: true })
            .on('error', $.sass.logError))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.dest + '/css'))
        // Autoprefix
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.autoprefixer('last 2 version', 'ie >= 9'))
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest(path.dest + '/css'));
});

gulp.task('static', function () {
    return gulp.src(path.static)
        .pipe(gulp.dest(path.dest + '/assets'));
});

gulp.task('clean', function () {
    return del([path.dest + '/*', './**/__pycache__/', '!' + path.dest + '/dist']);
});

gulp.task('default', ['sass', 'js:front', 'js:manager', 'static']);

gulp.task('run', function () {
    gulp.watch(path.sass, ['sass']);
    gulp.watch(path.frontJs, ['js:front']);
    gulp.watch(path.managerJs, ['js:manager']);
    gulp.watch(path.static, ['static']);
});
