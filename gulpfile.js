/// <binding BeforeBuild='default' Clean='clean' />
var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();

var path = {
    sass: ['./landing/**/*.scss'],
    js: ['./landing/**/*.js'],
    static: ['./landing/**/static/dist/**/*.*'],
    assets: [
        './bower_components/**/dist/*.*',
        './bower_components/**/lib/*.*',
        './bower_components/*/*.*'
    ],
    dest: './dist'
};

var sassIncludes = [
    './bower_components/foundation-sites/scss',
    './bower_components/motion-ui/src'
];


gulp.task('sass', function () {
    return gulp.src(path.sass)
        .pipe($.sourcemaps.init())
        .pipe($.sass({ includePaths: sassIncludes })
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'] }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.dest));
});

gulp.task('js', function () {
    return gulp.src(path.js)
        //.pipe($.sourcemaps.init())
        //.pipe($.uglify())
        //.pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.dest));
});

gulp.task('static', function () {
    return gulp.src(path.static)
        .pipe(gulp.dest(path.dest));
});

gulp.task('assets', function () {
    return gulp.src(path.assets)
        .pipe(gulp.dest(path.dest + '/dist'));
});

gulp.task('clean', function () {
    return del([path.dest, './**/__pycache__/']);
});

gulp.task('default', ['sass', 'js', 'static', 'assets']);
