var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    es = require('event-stream');

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
  frontEndJs: directories.frontend.dev + '/js/**/*.js',
  images: directories.frontend.dev + '/img/**/*',
  less: directories.less + '/**/*.less',
  css: directories.css + '/**/*.css',
  js: [directories.backend + '/**/*.js', directories.frontend.dev + '/js/**/*.js'],
  views: directories.frontend.dev + '/views/**/*.html',
  html: [directories.frontend.dev + '/*.html', directories.frontend.dev + '/views/**/*.html']
};

var server = require('./backend/config/all.json').server;

gulp.task('open', function() {

  var url = 'http://' + server.host + ':' + server.port;
  return gulp
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

  plugins.developServer.restart(function() {

    setTimeout(function() {
      plugins.livereload.changed();
      cb();
    }, 500);

  });

});

gulp.task('less', function() {

  return gulp
    .src(files.less)
    .pipe(plugins.plumber())
    .pipe(plugins.cached('less'))
    .pipe(plugins.less())
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
    .src(files.css)
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

var getTemplates = function() {

  return gulp
    .src(files.views)
    .pipe(plugins.angularHtmlify())
    .pipe(plugins.minifyHtml({empty: true, conditionals: true, spare: true, quotes: true}))
    .pipe(plugins.angularTemplatecache());

};

var getBowerAssets = function(isProduction) {
  return gulp.src(require('main-bower-files')(), {read: !!isProduction});
};

var getAppAssets = function(isProduction) {

  var css = gulp.src(files.css, {read: !!isProduction});
  var js = gulp.src(files.frontEndJs);

  if (isProduction) {
    js = es.merge(
      js,
      getTemplates()
    );
  }

  return es.merge(
    css,
    js.pipe(plugins.angularFilesort())
  );
};

var getProductionAssets = function(fileExtension) {

  return es.merge(
    getBowerAssets(true),
    getAppAssets(true)
  ).pipe(plugins.filter('**/*.' + fileExtension));
};

gulp.task('inject', ['less'], function() {

  return gulp
    .src(directories.frontend.dev + '/index.tpl.html')
    .pipe(plugins.inject(getBowerAssets(), {name: 'bower', relative: true}))
    .pipe(plugins.inject(getAppAssets(), {relative: true}))
    .pipe(plugins.rename('index.html'))
    .pipe(gulp.dest(directories.frontend.dev));

});

gulp.task('build:clean', function() {

  gulp
    .src(directories.frontend.prod, { read: false })
    .pipe(plugins.rimraf());

});

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('build:assets:js', ['lint'], function() {

  return getProductionAssets('js')
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('app.js'))
    .pipe(plugins.uglify())
    .pipe(plugins.header(banner, { pkg : pkg } ))
    .pipe(plugins.rev())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(directories.frontend.prod));
});

gulp.task('build:assets:css', ['lint', 'less'], function() {

  return getProductionAssets('css')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('app.css'))
    .pipe(plugins.minifyCss())
    .pipe(plugins.header(banner, { pkg : pkg } ))
    .pipe(plugins.rev())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(plugins.size({showFiles: true}))
    .pipe(gulp.dest(directories.frontend.prod));
});

gulp.task('build:assets', ['lint', 'build:clean', 'build:assets:js', 'build:assets:css'], function() {

  return gulp
    .src(directories.frontend.dev + '/index.tpl.html')
    .pipe(plugins.inject(
      gulp.src(
        [directories.frontend.prod + '/*.js', directories.frontend.prod + '/*.css'],
        {read: false}),
        {
          transform: function(filepath, file, index, length, targetFile) {
            var file = filepath.replace(directories.frontend.prod, '').replace(/\//g, '');
            if (file.indexOf('.css') > -1) {
              return '<link rel="stylesheet" href="' + file + '">';
            } else if (file.indexOf('.js') > -1) {
              return '<script src="' + file + '"></script>';
            }
          }
        }
      )
    )
    .pipe(plugins.rename('index.html'))
    .pipe(gulp.dest(directories.frontend.prod));

});

gulp.task('build:manifest', ['build:assets'], function() {

  return gulp
    .src(directories.frontend.prod + '/*')
    .pipe(plugins.manifest({
      hash: true,
      preferOnline: true,
      network: ['http://*', 'https://*', '*'],
      filename: 'app.manifest',
      exclude: 'app.manifest'
    }))
    .pipe(gulp.dest(directories.frontend.prod));

});

gulp.task('build:images', ['build:manifest'], function() {

  return gulp
    .src(files.images)
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(directories.frontend.prod + '/img'));

});

gulp.task('lint', ['jshint', 'jscs', 'htmlhint']);

gulp.task('build', ['build:images']);

gulp.task('watch', ['server:start'], function() {

  plugins.livereload.listen();

  gulp.watch(files.server, ['server:restart']);
  gulp.watch(files.less, ['less']);
  gulp.watch(['bower.json', files.css, files.frontEndJs], ['inject']);
  gulp.watch([files.server, files.frontEndJs, files.views], ['lint']);

  gulp.watch([
    'bower.json',
    files.css,
    files.frontEndJs,
    files.views,
    directories.frontend.dev + '/index.html'
  ]).on('change', plugins.livereload.changed);

});

gulp.task('default', ['watch']);