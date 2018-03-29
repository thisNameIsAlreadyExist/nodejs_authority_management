"use strict";
const gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    babel = require("gulp-babel"),
    sass = require("gulp-sass"),
    pump = require('pump');

gulp.task('compress_js', function (cb) {
    pump([
            gulp.src('webApp/js/*.js'),
            babel({presets:["env"]}),
            uglify(),
            gulp.dest('webApp/js/build/')
        ],
        cb
    );
});
gulp.task('compress_scss', function (cb) {
    pump([
            gulp.src('webApp/css/*.scss'),
            sass({outputStyle:"compressed"}).on("error",sass.logError),
            gulp.dest('webApp/css/build/')
        ],
        cb
    );
});


gulp.task("watch_js", function () {
    gulp.watch("webApp/js/*.js",["compress_js"]);
});
gulp.task("watch_scss", function () {
    gulp.watch("webApp/css/*.scss",["compress_scss"]);
});


gulp.task("default",["watch_js","watch_scss"]);