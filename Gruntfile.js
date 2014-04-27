module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    frontend: {
      // configurable paths
      dev: require('./bower.json').appPath || 'frontend/development',
      prod: 'frontend/production'
    },

    backend: {
      app: 'backend'
    },

    express: {
      options: {
        port: process.env.PORT || 3001,
        delay: 0
      },
      dev: {
        options: {
          script: '<%= backend.app %>/index.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: '<%= backend.app %>/index.js',
          node_env: 'production'
        }
      }
    },

    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },

    watch: {
      js: {
        files: ['<%= frontend.dev %>/js/**/*.js', '<%= backend.app %>/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      styles: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['<%= frontend.dev %>/stylesheets/less/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true,
          livereload: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '<%= frontend.dev %>/views/**/*.html',
          '<%= frontend.dev %>/stylesheets/**/*.css',
          '<%= frontend.dev %>/js/**/*.js',
          '<%= frontend.dev %>/img/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          '<%= backend.app %>/index.js',
          '<%= backend.app %>/**/*.{js,json}'
        ],
        tasks: ['newer:jshint:server', 'express:dev'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        force: true
      },
      server: {
        src: [ '<%= backend.app %>/**/*.js']
      },
      all: [
        '<%= frontend.dev %>/js/**/*.js'
      ]
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= frontend.prod %>'
          ]
        }]
      },
      server: '.tmp'
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= frontend.prod %>/scripts/**/*.js',
            '<%= frontend.prod %>/*.js',
            '<%= frontend.prod %>/stylesheets/**/*.css',
            '<%= frontend.prod %>/*.css',
            '<%= frontend.prod %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      }
    },

    useminPrepare: {
      html: ['<%= frontend.dev %>/index.html'],
      options: {
        dest: '<%= frontend.prod %>'
      }
    },

    usemin: {
      html: ['<%= frontend.prod %>/index.html', '<%= frontend.prod %>/views/**/*.html'],
      css: ['<%= frontend.prod %>/stylesheets/**/*.css'],
      options: {
        assetsDirs: ['<%= frontend.prod %>']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= frontend.dev %>/img',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= frontend.prod %>/img'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          //collapseWhitespace: true,
          //collapseBooleanAttributes: true,
          //removeCommentsFromCDATA: true,
          //removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= frontend.dev %>',
          src: ['*.html'],
          dest: '<%= frontend.prod %>'
        }]
      }
    },

    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    bowerInstall: {
      target: {
        src: [
          '<%= frontend.dev %>/index.tpl'
        ],
        exclude: [/jquery/, 'vendor/bootstrap/dist/js/bootstrap.js']
      }
    },

    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: [
          {
            expand: true,
            cwd: '<%= frontend.dev %>/stylesheets/less',
            src: ['common.less', 'modules/*.less'],
            dest: '<%= frontend.dev %>/stylesheets/css/',
            ext: '.css'
          }
        ]
      }
    },

    includeSource: {
      options: {
        basePath: '<%= frontend.dev %>',
        baseUrl: ''
      },
      myTarget: {
        files: {
          '<%= frontend.dev %>/index.html': '<%= frontend.dev %>/index.tpl'
        }
      }
    },

    ngtemplates:  {
      app:        {
        cwd:      '<%= frontend.dev %>',
        src:      'views/**/*.html',
        dest:     'template.js',
        options:  {
          usemin: 'app.min.js', // <~~ This came from the <!-- build:js --> block
          url:    function(url) { return '/' + url; }
        }
      }
    }

  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'prod') {
      return grunt.task.run(['build', 'express:prod', 'open', 'express-keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'less',
      'bowerInstall',
      'includeSource',
      'express:dev',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'includeSource',
    'useminPrepare',
    'htmlmin',
    'imagemin',
    'ngtemplates',
    'concat',
    'ngmin',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'clean:server'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'build'
  ]);

};