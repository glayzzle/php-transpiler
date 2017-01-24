module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        banner: '/*! <%= pkg.name %> - BSD3 License - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        alias: {
          'php-transpiler': './src/index.js'
        }
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': 'index.js' // ['src/*.js', 'src/**/*.js']
        }
      }
    },
    uglify: {
      options: {
        compress: {
          keep_fnames: true
        },
        sourceMap: true,
        mangle: false,
        maxLineLen: 1024
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['browserify', 'uglify']);

};
