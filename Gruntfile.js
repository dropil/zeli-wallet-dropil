module.exports = function (grunt) {
  const sass = require('node-sass')

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Compile Sass
    // -----------------------------------
    sass: {
      options: {
        implementation: sass,
        sourceMap: true,
        outputStyle: 'nested',
        includePaths: ['node_modules']
      },
      dev: {
        files: {
          'src/assets/css/light.css': 'src/assets/sass/main.scss',
          'src/assets/css/dark.css': 'src/assets/sass/themes/dark/main.scss'
        }
      },
      prod: {
        files: {
          'public/assets/css/light.css': 'src/assets/sass/main.scss',
          'public/assets/css/dark.css': 'src/assets/sass/themes/dark/main.scss'
        }
      }
    },

    // Begin CSS Minify Plugin
    // -----------------------------------
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/assets/css',
          src: ['*.css', '!*.min.css'],
          dest: 'public/assets/css',
          ext: '.min.css'
        }]
      }
    },

    // On Save...
    // -----------------------------------
    watch: {
      configFiles: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      },
      sass: {
        options: {
          livereload: false
        },
        files: [
          'src/assets/sass/*.scss',
          'src/assets/sass/**/*.scss'
        ],
        tasks: ['sass:dev']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-contrib-cssmin')

  grunt.registerTask('default', [
    'sass:dev',
    'watch'
  ])

  grunt.registerTask('live', [
    'sass:prod',
    'cssmin'
  ])
}
