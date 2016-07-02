var gulp    = require("gulp");
var tinyLr = require('tiny-lr');
var express = require ("express");
var concat  = require("gulp-concat");
var files   = require("./files.json");
var runSequence = require('run-sequence');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var del = require("del");
var lr;

var EXPRESS_PORT = 8000;
var EXPRESS_ROOT = __dirname + "/dist";
var LIVERELOAD_PORT = 35729;

function startLiveReload(){
  lr = tinyLr();  
  lr.listen(LIVERELOAD_PORT);
}

function startServer(){
  var app = express();
  console.log (EXPRESS_ROOT);
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
}

function notifyLivereload(event) {
  runSequence(["clean", 
    "styles", 
    "libs",
    "src",
    "fonts"
    ], function(){

      var fileName = require("path").relative(EXPRESS_ROOT, event.path);
 
      lr.changed({
        body: {
          files: [fileName]
        }
      });

    });
}

gulp.task("serve", function(){
  startServer();
});

gulp.task("clean", function() {
  return del("dist/**");
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
  .pipe(gulp.dest("./dist"))
});

gulp.task("fonts", function() {
  gulp.src(files.fonts)
  .pipe(gulp.dest("./dist/fonts"))
});

gulp.task("json", function() {
  gulp.src(files.json)
  .pipe(gulp.dest("./dist/"))
});

gulp.task("html", function() {
  gulp.src("src/index.html")
  .pipe(gulp.dest("./dist"));
  gulp.src("src/timezone.html")
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
  .pipe(gulp.dest("./dist"))
});

gulp.task("src", ["html", "images"], function() {
  gulp.src(files.src)
  .pipe(concat("src.js"))
  .pipe(gulp.dest("./dist"))
});

gulp.task("watch", function(){
  startServer();
  startLiveReload();
  gulp.watch(["src/**", "src/**/**"], notifyLivereload);
});

gulp.task("default", ["clean", "styles", "libs", "src", "fonts", "json"]);
