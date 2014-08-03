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

gulp.task('inject', ['less'], function() {

  return gulp
    .src(directories.frontend.dev + '/index.tpl.html')
    .pipe(plugins.inject(gulp.src(require('main-bower-files')(), {read: false}), {name: 'bower', relative: true}))
    .pipe(plugins.inject(es.merge(
      gulp.src(files.css, {read: false}),
      gulp.src(files.frontEndJs).pipe(plugins.angularFilesort())
    ), {relative: true}))
    .pipe(plugins.inject(gulp.src(directories.frontend.dev + '/templates.js', {read: false}), {name: 'templates', relative: true})) //gross hack
    .pipe(plugins.rename('index.html'))
    .pipe(gulp.dest(directories.frontend.dev));

});

gulp.task('build:clean', function() {

  gulp
    .src(directories.frontend.prod, { read: false })
    .pipe(plugins.rimraf());

});

gulp.task('build:assets', ['build:templates', 'lint', 'less', 'inject', 'build:clean'], function() {

  var pkg = require('./package.json');
  var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

  return gulp
    .src(directories.frontend.dev + '/index.html')
    .pipe(plugins.usemin({
      css: [
        plugins.sourcemaps.init(),
        'concat',
        plugins.minifyCss(),
        plugins.header(banner, { pkg : pkg } ),
        plugins.rev(),
        plugins.filesize(),
        plugins.sourcemaps.write('.')
      ],
      js: [
        plugins.sourcemaps.init(),
        plugins.ngAnnotate(),
        'concat',
        plugins.uglify(),
        plugins.header(banner, { pkg : pkg } ),
        plugins.rev(),
        plugins.filesize(),
        plugins.sourcemaps.write('.')
      ]
    }))
    .pipe(gulp.dest(directories.frontend.prod));

});

gulp.task('build:manifest', function() {

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

gulp.task('build:images', function() {

  return gulp
    .src(files.images)
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(directories.frontend.prod + '/img'));

});

gulp.task('build:templates', function() {

  gulp
    .src(files.views)
    .pipe(plugins.angularHtmlify())
    .pipe(plugins.minifyHtml({empty: true, conditionals: true, spare: true, quotes: true}))
    .pipe(plugins.angularTemplatecache())
    .pipe(gulp.dest(directories.frontend.dev));

});

gulp.task('build:clean-templates', function() { //This is a really gross hack, I'll think of a better solution at some point

  gulp
    .src(directories.frontend.dev + '/templates.js', {read: false})
    .pipe(plugins.rimraf());

  gulp.start('inject');

});

gulp.task('lint', ['jshint', 'jscs', 'htmlhint']);

gulp.task('build', ['build:assets'], function() {
  gulp.start('build:manifest');
  gulp.start('build:images');
  gulp.start('build:clean-templates');
});

gulp.task('watch', ['server:start'], function() {

  plugins.livereload.listen();

  gulp.watch(files.server, ['server:restart']);
  gulp.watch(files.less, ['less']);
  gulp.watch(['bower.json', files.css, files.frontEndJs], ['inject']);
  gulp.watch([files.server, files.frontEndJs, files.views], ['lint']);
  gulp.watch(['bower.json', files.css, files.frontEndJs, files.views]).on('change', plugins.livereload.changed);

});

gulp.task('default', ['watch']);