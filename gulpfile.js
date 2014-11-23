var gulp = require('gulp'),
    gp = require('gulp-load-plugins')(),
    streamqueue = require('streamqueue'),
    runSequence = require('run-sequence'),
    glob = require('glob'),
    uncssIgnore = require('./.uncssignore');

var directories = {
  frontend: {
    dev: require('./backend/services/app/config/development.json').frontendPath,
    prod: require('./backend/services/app/config/production.json').frontendPath
  },
  server: 'backend/index.js',
  backend: 'backend'
};

var files = {
  server: directories.backend + '/**/*.js',
  frontEndJs: directories.frontend.dev + '/app/**/*.js',
  images: directories.frontend.dev + '/img/**/*',
  less: directories.frontend.dev + '/app/**/*.less',
  css: directories.frontend.dev + '/app/.build/**/*.css',
  js: [directories.backend + '/**/*.js', directories.frontend.dev + '/app/**/*.js'],
  views: directories.frontend.dev + '/app/**/*.html',
  html: [directories.frontend.dev + '/*.html', directories.frontend.dev + '/app/**/*.html']
};

var server = require('./backend/services/app/config/all.json').server;

gulp.task('open', function() {

  var url = 'http://' + server.host + ':' + server.port;
  return gulp
    .src(directories.frontend.dev + '/index.tpl.html')
    .pipe(gp.open('', {url: url}));

});

function startServer(env) {

  return gp.developServer.listen({ path: directories.server, env: env }, function(err) {
    if (!err) {
      setTimeout(function() {
        <% if (hasFrontend) { %>gulp.start('open');<% } %>
      }, 1000);
    }
  });

}

gulp.task('server:start:dev', ['inject'], function() {
  startServer({});
});

gulp.task('server:start:prod', function() {
  startServer({NODE_ENV: 'production'});
});

gulp.task('server:restart', function(cb) {

  gp.developServer.restart(function() {

    setTimeout(function() {
      gp.livereload.changed();
      cb();
    }, 500);

  });

});
<% if (hasFrontend) { %>
gulp.task('less', function() {

  return gulp
    .src(files.less)
    .pipe(gp.plumber())
    .pipe(gp.cached('less'))
    .pipe(gp.less())
    .pipe(gulp.dest(directories.frontend.dev + '/app/.build'));

});

gulp.task('jshint', function() {

  return gulp
    .src(files.js)
    //.pipe(gp.cached('jshint'))
    .pipe(gp.jshint())
    .pipe(gp.jshint.reporter('jshint-stylish'))
    .pipe(gp.notify(function (file) {
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
    //.pipe(gp.cached('jscs'))
    .pipe(gp.plumber({errorHandler: gp.notify.onError('The JavaScript code standards check failed, please correct your code!')}))
    .pipe(gp.jscs('.jscsrc'));

});

gulp.task('htmlhint', function() {

  return gulp
    .src(files.html)
    //.pipe(gp.cached('htmlhint'))
    .pipe(gp.htmlhint('.htmlhintrc'))
    .pipe(gp.htmlhint.reporter())
    .pipe(gp.notify(function (file) {
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
    //.pipe(gp.cached('csslint'))
    .pipe(gp.csslint())
    .pipe(gp.csslint.reporter())
    .pipe(gp.notify(function (file) {
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
    .pipe(gp.angularHtmlify())
    .pipe(gp.htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gp.angularTemplatecache({
      standalone: false,
      module: '<%= _.slugify(angularAppName) %>.views',
      root: 'app/'
    }));

};

var getBowerAssets = function(isProduction) {
  return gulp.src(require('main-bower-files')(), {read: !!isProduction});
};

var mergeStreams = function(stream1, stream2) {
  return streamqueue({ objectMode: true }, stream1, stream2);
}

var getAppAssets = function(isProduction) {

  var css = gulp.src(files.css, {read: !!isProduction});
  var js = gulp.src(files.frontEndJs);

  if (isProduction) {
    js = mergeStreams(
      getTemplates(),
      js
    );
  }

  return mergeStreams(
    css,
    js.pipe(gp.plumber()).pipe(gp.angularFilesort())
  );
};

var getProductionAssets = function(fileExtension) {

  return mergeStreams(
    getBowerAssets(true),
    getAppAssets(true)
  ).pipe(gp.filter('**/*.' + fileExtension));

};

gulp.task('inject', ['less'], function() {

  return gulp
    .src(directories.frontend.dev + '/index.tpl.html')
    .pipe(gp.plumber())
    .pipe(gp.inject(getBowerAssets(), {name: 'bower', relative: true}))
    .pipe(gp.inject(getAppAssets(), {relative: true}))
    .pipe(gp.rename('index.html'))
    .pipe(gulp.dest(directories.frontend.dev));

});

gulp.task('build:clean', function() {

  gulp
    .src(directories.frontend.prod, { read: false })
    .pipe(gp.rimraf());

});

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('build:assets:js', function() {

  return getProductionAssets('js')
    .pipe(gp.dereserve())
    .pipe(gp.ngAnnotate())
    .pipe(gp.sourcemaps.init())
    .pipe(gp.concat('app.js'))
    .pipe(gp.uglify())
    .pipe(gp.header(banner, { pkg : pkg } ))
    .pipe(gp.rev())
    .pipe(gp.sourcemaps.write('.'))
    .pipe(gp.size({showFiles: true}))
    .pipe(gulp.dest(directories.frontend.prod));
});

gulp.task('build:assets:css', ['less'], function() {

  var cssFiles = require('main-bower-files')().filter(function(file) {
    return file.indexOf('.css') > -1;
  });
  cssFiles.push(files.css);

  return gulp
    .src(cssFiles)
    .pipe(gp.sourcemaps.init())
    .pipe(gp.concat('app.css'))
    .pipe(gp.replace('../fonts/fontawesome', 'fonts/fontawesome'))
    .pipe(gp.uncss({
      html: glob.sync(files.views).concat([directories.frontend.dev + '/index.html']),
      ignore: uncssIgnore
    }))
    .pipe(gp.autoprefixer())
    .pipe(gp.minifyCss())
    .pipe(gp.header(banner, { pkg : pkg } ))
    .pipe(gp.rev())
    .pipe(gp.sourcemaps.write('.'))
    .pipe(gp.size({showFiles: true}))
    .pipe(gulp.dest(directories.frontend.prod));
});

gulp.task('build:assets', ['build:assets:js', 'build:assets:css'], function() {

  return gulp
    .src(directories.frontend.dev + '/index.tpl.html')
    .pipe(gp.inject(
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
    .pipe(gp.rename('index.html'))
    .pipe(gulp.dest(directories.frontend.prod));

});

gulp.task('build:manifest', function() {

  return gulp
    .src(directories.frontend.prod + '/*')
    .pipe(gp.manifest({
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
    .pipe(gp.imagemin())
    .pipe(gulp.dest(directories.frontend.prod + '/img'));

});

gulp.task('build:assets:fonts', function() {
  return gulp
    .src(directories.frontend.dev + '/**/fonts/fontawesome-webfont.*')
    .pipe(gp.flatten())
    .pipe(gulp.dest(directories.frontend.prod + '/fonts'));
});

gulp.task('build', function(callback) {

  runSequence(['lint', 'build:clean'], ['build:assets', 'build:images', 'build:assets:fonts'], 'build:manifest', 'server:start:prod', callback);

});

gulp.task('lint', ['jshint', 'jscs', 'htmlhint']);

gulp.task('apidoc', function() {
  return gp.apidoc.exec({
    src: 'backend/',
    dest: 'frontend/development/api/'
  });
});
<% } %>
gulp.task('workers:start', function() {

  var options = {
    script: 'backend/workers/index.js',
    ext: 'js',
    watch: ['backend'],
    env: {
      NODE_ENV: 'development',
      DEBUG: 'worker:*',
      TZ: 'Etc/UTC',
      CRON_RUNNER: 1
    }
  };

  gp.nodemon(options);

});

gulp.task('watch', ['server:start:dev', 'workers:start'], function() {

  gp.livereload.listen();

  gulp.watch(files.server, ['server:restart']);
  gulp.watch(files.less, ['less']);
  <% if (hasFrontend) { %>gulp.watch(['bower.json', files.css, files.frontEndJs, directories.frontend.dev + '/index.tpl.html'], ['inject']);<% } %>
  gulp.watch([files.server<% if (hasFrontend) { %>, files.frontEndJs, files.views<% } %>], ['lint']);

  <% if (hasFrontend) { %>gulp.watch([
    'bower.json',
    files.css,
    files.frontEndJs,
    files.views
  ]).on('change', gp.livereload.changed);<% } %>

});

gulp.task('default', ['watch']);

function gracefulShutdown() {
  gp.developServer.kill('SIGTERM', function(err) {
    process.exit(0);
  });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT' , gracefulShutdown);
process.on('uncaughtException' , gracefulShutdown);
