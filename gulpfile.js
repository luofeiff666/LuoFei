var gulp = require('gulp')
var sftp = require('gulp-sftp')
var sftpConfig = require('./project.config.js').sftpConfig
const filesPath = [
  './**',
  '!./node_modules/**',
  '!./.git/**',
  '!./.vscode/**',
  '!./*.zip'
]
gulp.task('upload', function() {
  return gulp
    .src(filesPath, {
      dot: true
    })
    .pipe(sftp(sftpConfig))
})
