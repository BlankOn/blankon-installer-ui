var gulp    = require("gulp");
var concat  = require("gulp-concat");
var clean   = require("gulp-clean");
var files   = require("./files.json");
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var uglify = require("gulp-uglify");

gulp.task("clean", function() {
  return gulp.src(["dist/*"], {read:false}).pipe(clean());
});

gulp.task("libs", function() {
  gulp.src(files.libs)
  .pipe(concat("libs.js"))
  .pipe(gulp.dest("./dist/"))
});

gulp.task("styles", function() {
  gulp.src(files.styles)
  .pipe(concat("app.css"))
  .pipe(gulp.dest("./dist/"))
});

gulp.task("images", function() {
  gulp.src(files.images)
  .pipe(gulp.dest("./dist/images"))
});

gulp.task("fonts", function() {
  gulp.src(files.fonts)
  .pipe(gulp.dest("./dist/fonts"))
});

gulp.task("html", function() {
  gulp.src("src/index.html")
  .pipe(gulp.dest("./dist"));

  gulp.src(files.html)
  .pipe(minifyHtml({
    empty: true,
    spare: true,
    quotes: true
  }))
  .pipe(ngHtml2Js({
    moduleName: "html"
  }))
  .pipe(concat("html.min.js"))
  .pipe(uglify())
  .pipe(gulp.dest("./dist"))
});

gulp.task("src", ["html", "images"], function() {
  gulp.src(files.src)
  .pipe(concat("src.js"))
  .pipe(gulp.dest("./dist"))
});


gulp.task("default", [
    "clean", 
    "styles", 
    "libs",
    "src",
    "fonts"
    ]);
