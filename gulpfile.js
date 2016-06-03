/// <binding AfterBuild='default' Clean='clean' />
var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();

var path = {
    sass: ['./landing/**/*.scss', '!./landing/static/'],
    js: ['./landing/**/*.js', '!./landing/static/'],
    assets: [
        './langing/(blocks|templates)/**/assets/**/*',
        './bower_components/**/dist/*.*',
        './bower_components/*/*.css',
        './bower_components/*/*.js',
    ],
    dest: './landing/static'
};

var sassIncludes = [
    './bower_components/foundation-sites/scss',
    './bower_components/motion-ui/src'
];


gulp.task('sass', function() {
    return gulp.src(path.sass)
        .pipe($.sass({ includePaths: sassIncludes })
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'] }))
        .pipe(gulp.dest(path.dest + '/styles'));
});

gulp.task('js', function() {
    return gulp.src(path.js)
        .pipe($.sourcemaps.init())
        .pipe($.concat('bundle.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.dest + '/scripts'));
});

gulp.task('assets', function() {
    return gulp.src(path.assets)
        .pipe(gulp.dest(path.dest));
});

gulp.task('clean', function() {
    return del([path.dest]);
});

gulp.task('default', ['sass', 'js', 'assets']);

gulp.task('run', ['default'], function() {
    gulp.watch([path.sass], ['sass']);
    gulp.watch([path.js], ['js']);
    gulp.watch([path.assets], ['assets']);
});
