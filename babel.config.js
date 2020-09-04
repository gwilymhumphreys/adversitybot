module.exports = function(api) {
  api.cache(true)

  return {
    presets: [['@babel/preset-env', {modules: process.env.BABEL_ENV === 'node' ? 'commonjs' : false}]],
    plugins: [
      ['@babel/plugin-proposal-decorators', {legacy: true}],
      ['@babel/plugin-proposal-class-properties', {loose : true}],
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-object-rest-spread',
      'add-module-exports',
      'transform-require-default',
    ]
  }
}
