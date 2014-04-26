module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowerInstall: {
      target: {
        src: [
          'frontend/development/index.html'
        ],
        exclude: [/jquery/, 'vendor/bootstrap/dist/js/bootstrap.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-install');

  // Default task(s).
  grunt.registerTask('default', []);

  grunt.registerTask('bower', ['bowerInstall']);

};