module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      browser: {
        src: ['analytics.js'],
        options: {
          sub: true,
          globals: {
            _gaq: true,
            ga: true
          }
        }
      }
    },
    qunit: {
      src: ['test/index.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', 'qunit:src');
  grunt.registerTask('lint', 'jshint');

  grunt.registerTask('default', ['jshint', 'qunit:src']);
};

