// Dependencies
var gulp = require('gulp')
  , plugins = require('gulp-load-plugins')()
  // , plugins = gulpLoadPlugins()
  , mainBowerFiles = require('main-bower-files');

// Paths
var dirs = {
  dev: {
    img:     ['assets/img/**/*'],
    js:      ['assets/js/**/*'],
    jslibs:  ['assets/jslibs/**/*'],
    css:     ['assets/css/**/*'],
    misc:    ['assets/misc/**/*']
  },
  prod: {
    images:   'public/img',
    scripts:  'public/js',
    styles:   'public/css',
    misc:     'public/misc'
  }
};

function errorHandler(error) {
  console.log(error.message);
  return true;
}

gulp.task('misc', function() {
  gulp.src(dirs.dev.misc)
  .pipe(gulp.dest(dirs.prod.misc))
  .on('error', function(error) { errorHandler(error) })
});

// // ----------------------------------------------------------------
// // Styles

  gulp.task('css', function () {
    gulp.src(dirs.dev.css)
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.size({showFiles: true}))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(dirs.prod.styles))
    .on('error', function(error) { errorHandler(error) })
  });

// // ----------------------------------------------------------------
// // Javascript

  // Vendor JS
  gulp.task('libs', function() {
    gulp.src(mainBowerFiles().concat(dirs.dev.jslibs))
    .pipe(plugins.concat('libs'))
    .pipe(plugins.size({showFiles: true}))
    .pipe(plugins.uglify({mangle: true}))
    .pipe(plugins.rename({suffix: '.min.js'}))
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(dirs.prod.scripts))
    .on('error', function(error) { errorHandler(error) })
  });

  // Project JS
  gulp.task('js', function() {
    gulp.src(dirs.dev.js)
    .pipe(plugins.size({showFiles: true}))
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat('app'))
      .pipe(plugins.uglify({mangle: false}))
    .pipe(plugins.rename({suffix: '.min.js'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(dirs.prod.scripts))
    .on('error', function(error) { errorHandler(error) })
  });

// ----------------------------------------------------------------
// Tasks

gulp.task('watch', function() {
  gulp.watch(dirs.dev.js,     ['js']);
  gulp.watch(dirs.dev.jslibs, ['libs']);
  gulp.watch(dirs.dev.json,   ['json']);
  //
  gulp.watch(dirs.dev.css,    ['css']);
  //
  gulp.watch(dirs.dev.misc,   ['misc']);
});

gulp.task('build', ['css', 'js', 'libs', 'misc']);
gulp.task('default', ['build', 'watch']);
