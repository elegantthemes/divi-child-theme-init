'use strict'

module.exports = (grunt) ->

  require('time-grunt')(grunt)
  require('jit-grunt')(grunt)

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    clean:
      release: [
        'package.json'
        '.DS_STORE'
        'bower.json'
        '.bowerrc'
        'bower_components'
        '.gitignore'
        '.gitmodules'
        '.gitattributes'
        'scss'
        '*.scss'
        '*.sass'
        '*.map'
        '.sass-cache'
        'csscomb.json'
        'Gruntfile.js'
        'node_modules'
      ]

    compress:
      release:
        options:
          archive: '../<%= pkg.name %>.zip'
          mode: 'zip'
          level: 9

        files: [{
          expand: true,
          src: [
            '**'
            '!**/.git/**'
            '!**/.gitignore'
            '!**/.gitmodules'
            '!**/.git'
            '!**/.DS_STORE/**'
            '!**/*.zip'
            '!**/src/**'
            '!**/styles/**'
            '!.sass-cache'
            '!csscomb.json'
            '!**/*.map'
            '!**/.bowerrc'
            '!**/bower.json'
            '!**/node_modules/**'
            '!**/package.json'
            '!**/Gruntfile.js'
          ]
          dest: '<%= pkg.name %>'
        }]

    shell:
      npm:
        command: 'npm install'

    sass:
      options:
        precision: 6
        style: 'expanded'

      dev:
        options:
          sourcemap: 'auto'
        files:
          'style.css': 'styles/scss/style.scss'

      dist:
        options:
          sourcemap: false

        files:
          'style.css': 'styles/scss/style.scss'

    less:
      options:
        compress: false,
        strictUnits: true


      dev:
        options:
          sourceMap: true,
          strictUnits: true

        files:
          'style.css': 'styles/less/style.less'

      dist:
        options:
          sourceMap: true,
          strictUnits: true

        files:
          'style.css': 'styles/less/style.less'

    csscomb:
      dist:
        options:
          config: 'grunt/csscomb.json'

        files:
          'style.css': ['style.css']

    postcss:
      dev:
        options:
          map: true,
          processors: [
            require('autoprefixer')({
              browsers: ['last 2 versions']
            })
          ]

        src: 'style.css'

      dist:
        options:
          map: false,
          processors: [
            require('autoprefixer')({
              browsers: ['last 6 versions']
            })
          ]

        src: 'style.css'

    coffeelint:
      dev:
        options:
          configFile: 'grunt/coffeelint.json'
        files:
          src: [
            '**/*.coffee'
            '!**/node_modules/**'
          ]

    notify:
      options:
        title: 'Grunt'

      init:
        options:
          message: 'Grunt has been initiated.'

      release:
        options:
          message: 'Grunt has cleaned up your theme for release.'

      grunt:
        options:
          message: 'Grunt has been updated.'

      sass:
        options:
          message: 'Sass files has been compiled.'

      less:
        options:
          message: 'Less files has been compiled.'

    wakeup:
      complete:
        options:
          custom: 'grunt/pop.mp3'
          output: false

    watch:
      options:
        livereload: true
        dateFormat: (time) ->
          grunt.log.writeln('Grunt has finished in ' + time + 'ms!')
          grunt.log.writeln('Waiting...')
        event: ['all']
        interrupt: true

      configFiles:
        options:
          reload: true
        files: 'Gruntfile.coffee'
        tasks: [
          'coffeelint'
          'notify:grunt'
          'wakeup:complete'
        ]

      npm:
        files: ['package.json']
        task: [
          'shell:npm'
          'wakeup:complete'
        ]

      sass:
        files: ['styles/**/*.{scss,sass}']
        tasks: [
          'sass-build'
          'wakeup:complete'
        ]

      less:
        files: ['styles/**/*.less']
        tasks: [
          'less-build'
          'wakeup:complete'
        ]

      js:
        files: ['js/**/*.js']

  # Sass Tasks
  grunt.registerTask 'sass-build', [
    'sass:dev'
    'postcss:dev'
    'notify:sass'
  ]
  grunt.registerTask 'sass-dev', [
    'sass-build'
    'notify:init'
    'wakeup:complete'
    'watch:sass'
  ]
  grunt.registerTask 'sass-dist', [
    'sass:dist'
    'csscomb:dist'
    'postcss:dist'
    'notify:release'
    'compress:release'
  ]

  # Less Tasks
  grunt.registerTask 'less-build', [
    'less:dev'
    'postcss:dev'
    'notify:less'
  ]

  grunt.registerTask 'less-dev', [
    'less-build'
    'notify:init'
    'wakeup:complete'
    'watch:less'
  ]

  grunt.registerTask 'less-dist', [
    'less:dist'
    'csscomb:dist'
    'postcss:dist'
    'notify:release'
    'wakeup:complete'
    'compress:release'
  ]

  # Default Task
  grunt.registerTask 'default', [
    'notify:init'
    'wakeup:complete'
    'watch'
  ]
