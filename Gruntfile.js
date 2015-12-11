module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Clean
    clean: {
      release: [
        'package.json', '.DS_STORE',
        'bower.json', '.bowerrc', 'bower_components',
        '.gitignore', '.gitmodules', '.gitattributes',
        'scss', '*.scss', '*.sass', '*.map', '.sass-cache', 'csscomb.json',
        'Gruntfile.js', 'node_modules'
      ]
    },

    // Compress
    compress: {
      release : {
        options : {
          archive : '../<%= pkg.name %>.zip',
          mode    : 'zip',
          level   : 9
        },
        files : [
          {
            expand : true,
            src : [
              '**',
              '!**/.git/**',
              '!**/.gitignore',
              '!**/.gitmodules',
              '!**/.git',
              '!**/.DS_STORE/**',
              '!**/*.zip',
              '!**/styles/**',
              '!.sass-cache',
              '!csscomb.json',
              '!**/*.map',
              '!**/.bowerrc',
              '!**/bower.json',
              '!**/node_modules/**',
              '!**/package.json',
              '!**/Gruntfile.js',
            ],
            dest : '<%= pkg.name %>'
          }
        ]
      }
    },

    // Sass
    sass: {
      options: {
        precision: 6,
        style: 'expanded',
      },

      dev: {
        options: {
          sourcemap: 'auto'
        },
        files: {
          'style.css': 'styles/scss/style.scss'
        }
      },

      dist: {
        options: {
          sourcemap: false
        },
        files: {
          'style.css': 'styles/scss/style.scss'
        }
      }
    },

    // Less
    less: {
      options: {
        compress: false,
        strictUnits: true
      },

      dev: {
        options: {
          sourceMap: true,
          strictUnits: true
        },
        files: {
          'style.css': 'styles/less/style.less'
        }
      },

      dist: {
        options: {
          sourceMap: true,
          strictUnits: true
        },
        files: {
          'style.css': 'styles/less/style.less'
        }
      }
    },

    // CSSComb
    csscomb: {
      dist: {
        options: {
          config: 'styles/.csscomb.json'
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
      },

      less: {
        options: {
          message: 'Less files has been compiled.'
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
        files: '**/*.{scss,sass}',
        tasks: ['sass-dev', 'notify:sass'],
      },

      less: {
        files: '**/*.less',
        tasks: ['less-dev', 'notify:less'],
      }
    }
  });

  grunt.registerTask('sass-dist', ['sass:dist', 'csscomb:dist', 'postcss:dist', 'cssmin:dist', 'notify:release', 'compress:release']);
  grunt.registerTask('sass-dev', ['sass:dev', 'postcss:dev']);

  grunt.registerTask('less-dist', ['less:dist', 'csscomb:dist', 'postcss:dist', 'cssmin:dist', 'notify:release', 'compress:release']);
  grunt.registerTask('less-dev', ['less:dev', 'postcss:dev']);

  grunt.registerTask('default', ['notify:init', 'watch']);
};