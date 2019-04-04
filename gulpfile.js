var gulp = require("gulp");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
var gulpIf = require("gulp-if");
var usemin = require("gulp-usemin");
var rev = require("gulp-rev");
var htmlmin = require("gulp-htmlmin");
var babel = require("gulp-babel");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var del = require("del");
var gulpPlumber = require("gulp-plumber");

// scss 注入并更新
gulp.task("sass", function() {
  var plugins = [autoprefixer({ browsers: ["last 1 version"] }), cssnano()];
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(
      gulpPlumber({
        errorHandler: function() {
          this.emit("end");
        }
      })
    )
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest("app/css"))
    .pipe(reload({ stream: true }));
});

gulp.task("script", function() {
  return gulp
    .src("app/js/*.js")
    .pipe(gulpPlumber())
    .pipe(gulp.dest("app/js/"))
    .pipe(reload({ stream: true }));
});

gulp.task("usemin", function() {
  return gulp
    .src("./app/**/*.html")
    .pipe(
      usemin({
        html: [
          function() {
            return htmlmin({
              collapseWhitespace: true,
              removeComments: true
            });
          }
        ],
        js: [babel, uglify, rev],
        css: [rev]
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("copyjs", function() {
  return gulp
    .src(["app/css/**/*min.js"])
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
});

// 服务器/监听 scss/html/js
gulp.task(
  "serve",
  gulp.series("sass", function() {
    browserSync.init({
      server: { baseDir: "app" },
      port: 30001
    });
    gulp.watch("app/scss/**/*.scss", gulp.series("sass"));
    gulp.watch("app/*.html").on("change", reload);
    gulp.watch("app/js/*.js").on("change", reload);
  })
);

gulp.task("clean:dist", function() {
  return del(["dist"]);
});

gulp.task(
  "build",
  gulp.series("clean:dist", gulp.parallel("sass", "usemin", "copyjs"))
);
