var gulp   = require('gulp');
var config = require('../config');

gulp.task('watch', 
    ['copy:watch',
    
    'nunjucks:watch',
    'svgo:watch',
    'list-pages:watch',
    'webpack:watch',
    'sass:watch'
]);
