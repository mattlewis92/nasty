var gulp = require('gulp')
  , plugins = require('gulp-load-plugins')();

var directories = {
  frontend: {
    dev: require('./backend/config/development.json').frontendPath,
    prod: require('./backend/config/production.json').frontendPath
  },
  server: 'backend/index.js',
  backend: 'backend'
};
directories.less = directories.frontend.dev + '/stylesheets/less/';
directories.css = directories.frontend.dev + '/stylesheets/css/';

var files = {
  server: directories.backend + '/**/*.js',
  less: directories.less + '/**/*.less',
  css: directories.css + '/**/*.css',
  js: [directories.backend + '/**/*.js', directories.frontend.dev + '/js/**/*.js'],
  html: [directories.frontend.dev + '/*.html', directories.frontend.dev + '/views/**/*.html']
};

var server = require('./backend/config/all.json').server;

gulp.task('open', function() {
  var url = 'http://' + server.host + ':' + server.port;
  gulp
    .src(directories.frontend.dev + '/index.html')
    .pipe(plugins.open('', {url: url}));
});

gulp.task('server:start', function() {
  plugins.developServer.listen({ path: directories.server }, function(err) {
    if (!err) {
      gulp.start('open');
    }
  });
});

gulp.task('server:restart', function(cb) {
  plugins.developServer.restart(cb);
});

gulp.task('watch', ['server:start'], function() {
  gulp.watch(files.server, ['server:restart']);
  //gulp.watch(files.less, ['less']);
});

gulp.task('less', function() {
  return gulp
    .src(files.less)
    .pipe(plugins.plumber())
    .pipe(plugins.cached('less'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(directories.css));
});

gulp.task('jshint', function() {
  return gulp
    .src(files.js)
    .pipe(plugins.cached('jshint'))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.notify(function (file) {
      if (file.jshint.success) {
        // Don't show something if success
        return false;
      }

      return 'JSHint found some errors, check the console.';
    }));
});

gulp.task('jscs', function() {
  return gulp
    .src(files.js)
    .pipe(plugins.cached('jscs'))
    .pipe(plugins.plumber({errorHandler: plugins.notify.onError('The JavaScript code standards check failed, please correct your code!')}))
    .pipe(plugins.jscs('.jscsrc'));
});

gulp.task('htmlhint', function() {
  return gulp
    .src(files.html)
    .pipe(plugins.cached('htmlhint'))
    .pipe(plugins.htmlhint('.htmlhintrc'))
    .pipe(plugins.htmlhint.reporter())
    .pipe(plugins.notify(function (file) {
      if (file.htmlhint.success) {
        // Don't show something if success
        return false;
      }

      return 'HTML hint found some errors, check the console.';
    }));
});

gulp.task('csslint', ['less'], function() {
  return gulp
    .src([files.css, '!' + directories.css + '/common.css'])
    .pipe(plugins.cached('csslint'))
    .pipe(plugins.csslint())
    .pipe(plugins.csslint.reporter())
    .pipe(plugins.notify(function (file) {
      if (file.csslint.success) {
        // Don't show something if success
        return false;
      }

      return 'CSS lint found some errors, check the console.';
    }));
});

gulp.task('lint', ['jshint', 'jscs', 'htmlhint', 'csslint']);

gulp.task('default', function() {

  plugins.util.log('HELLO WORLD!', directories);

});