module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    'dynamic-import-node',
    'css-modules-transform',
  ],
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', {
      targets: {
        browsers: 'last 1 Chrome version',
        node: 'current',
      },
      modules: 'commonjs',
      useBuiltIns: 'usage',
      corejs: '2',
    }],
  ],
};
