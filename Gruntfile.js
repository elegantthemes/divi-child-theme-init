module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      release: [
        'package.json',
        'bower.json', '.bowerrc',
        '.gitignore', '.gitmodules',
        'scss', '*.scss', '*.sass', '*.map', '.sass-cache',
        'bower_components', 'Gruntfile.js', 'node_modules',
      ]
    },

    // Sass
    sass: {
      dev: {
        options: {
          precision: 6,
          sourcemap: 'auto',
          style: 'expanded',
        },
        files: {
          'style.css': 'styles/style.scss'
        }
      },

      dist: {
        options: {
          precision: 6,
          sourcemap: false,
          style: 'expanded',
        },
        files: {
          'style.css': 'styles/style.scss'
        }
      }
    },

    // CSSComb
    csscomb: {
      dist: {
        options: {
          config: 'csscomb.json'
        },
        files: {
          'style.css': ['style.css'],
        }
      }
    },

    // Post CSS
    postcss: {
      dev: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({
              browsers: ['last 2 versions']
            })
          ]
        },
        src: 'style.css'
      },

      dist: {
        options: {
          map: false,
          processors: [
            require('autoprefixer')({
              browsers: ['last 6 versions']
            })
          ]
        },
        src: 'style.css'
      }
    },

    // CSSMin
    cssmin: {
      dist: {
        options: {
          sourceMap: false,
          shorthandCompacting: false,
          roundingPrecision: -1
        },
        files: 'style.css'
      }
    },

    // Notification
    notify: {
      options: {
        title: 'Grunt'
      },

      init: {
        options: {
          message: 'Grunt has been initiated.'
        }
      },

      release: {
        options: {
          message: 'Grunt has cleaned up your theme for release.'
        }
      },

      grunt: {
        options: {
          message: 'Grunt has been updated.'
        }
      },

      sass: {
        options: {
          message: 'Sass files has been compiled.'
        }
      }
    },

    // Watch
    watch: {
      options: {
        livereload: true,
        dateFormat: function (time) {
          grunt.log.writeln('Grunt has finished compiling in ' + time + 'ms!');
          grunt.log.writeln('Preparing for next task...');
        },
        event: ['all']
      },

      configFiles: {
        files: ['Gruntfile.js'],
        tasks: ['notify:grunt'],
        options: {
          reload: true
        }
      },

      sass: {
        files: '*/**.{scss,sass}',
        tasks: ['dev', 'notify:sass'],
      }
    }
  });

  grunt.registerTask('dist', ['sass:dist', 'csscomb:dist', 'postcss:dist', 'cssmin:dist', 'notify:release', 'clean:release']);
  grunt.registerTask('dev', ['sass:dev', 'postcss:dev']);
  grunt.registerTask('default', ['notify:init', 'dev', 'watch']);
};