module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'Wheely',
      externals: {
        react: 'React'
      }
    }
  }
}
