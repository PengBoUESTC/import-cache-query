export default {
  releaseBranch: ['master', 'main'], // which git branch can be released
  releaseUser: ['pengbo-study'], // who can publish this pkg
  scripts: {
    build: 'build', // if exist, run build command
    changelog: 'changelog', //if exist, run changelog command
  },
  tag: true, // need git tag?
  release: true
}