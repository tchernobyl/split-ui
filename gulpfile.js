var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-replace');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var rev = require('gulp-rev');
var argv = require('yargs').argv;
var rename = require("gulp-rename");
var config = {
    path: {
        tmp: '.tmp',
        app: 'app',
        build: 'build'
    }
};

gulp.task('connect', function () {
    connect.server({
        root: ['.', config.path.app, config.path.tmp],
        livereload: true
    });
});

gulp.task('sass', function () {
    return gulp.src('app/app.scss')
        .pipe(sass())
        .pipe(gulp.dest(config.path.tmp));
});

gulp.task('livereload', function () {
    gulp.src(['app/**/*.js', 'app/**/*.html', '.tmp/app.css'])
        .pipe(watch())
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('app/app.scss', ['sass']);
    gulp.watch('app/**/*.js', ['build']);
});

gulp.task('serve', ['sass', 'connect', 'livereload', 'watch']);

gulp.task('clean', function (cb) {
    return rimraf(config.path.build, cb);
});

gulp.task('usemin', function () {
    var buildEnv = argv.env || 'production';
    return gulp.src('app/index.html')
        .pipe(replace('app.css', '../.tmp/app.css'))
        .pipe(replace('<script src="app.js"></script>', '<script src="app.js"></script><script src="../.tmp/templates.js"></script>'))

        .pipe(usemin({
            css: [minifyCss(), 'concat', rev(), replace('../images', 'image')],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest(config.path.build));
});

gulp.task('statLibs', function () {
    gulp.src('app/stat/file.js')
        .pipe(gulp.dest(config.path.build + '/stat'));


});


gulp.task('images', function () {
    gulp.src('app/images/loading.gif')
        .pipe(gulp.dest(config.path.build + '/css/images'));
    gulp.src('app/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.path.build + '/images'));
});


gulp.task('fonts', function () {
    gulp.src('bower_components/font-awesome/fonts/**/*')
        .pipe(gulp.dest(config.path.build + '/fonts'));
});


gulp.task('template', function () {
    return gulp.src('app/**/*.html')
        .pipe(templateCache({module: 'app'}))
        .pipe(gulp.dest(config.path.tmp));
});


gulp.task('build', function (callback) {
    runSequence('clean',
        ['sass', 'template', 'fonts', 'images', 'statLibs'],
        // uncomment if you want to use dummy data

        'usemin',
        callback
    );
});
