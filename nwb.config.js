module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'wheely',
      externals: {
        react: 'React',
      },
    },
  },
};
