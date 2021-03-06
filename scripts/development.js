const spawn = require('cross-spawn');
const path = require('path');
const webpack = require('webpack');
const webpackConfigClient = require('../config/webpack.config.client');
const webpackConfigServer = require('../config/webpack.config.server');

const injectVariables = new webpack.DefinePlugin({
  process: {
    env: {
      NODE_ENV: JSON.stringify('development'),
      BROWSER: JSON.stringify('true'),
      SERVER: JSON.stringify('false'),
    },
  },
});
const compiler = webpack([
  {
    ...webpackConfigClient,
    mode: 'development',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, '..', 'dist', 'public'),
      filename: '[name].[contenthash:8].js', // name will be replaced with the key from the entry dictionary
      chunkFilename: '[name].[contenthash:8].chunk.js',
      publicPath: '',
    },
    plugins: [...webpackConfigClient.plugins, injectVariables],
  },
  {
    ...webpackConfigServer,
    mode: 'development',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, '..', 'dist/src'),
      filename: 'server.js',
    },
  },
]);

let server;

process.on('unhandledRejection', (err) => {
  throw err;
});

console.log(`compiling ...`);
console.log();
compiler.hooks.watchRun.tap('Dev', (compiler) => {
  if (server) {
    // if server has value it means server has already started once so kill server and remove its value
    // to run again else address already used error will be thrown
    server.kill();
    server = undefined;
  }
});

compiler.watch({}, (err, stats) => {
  if (err) {
    console.log({ err });
    process.exit(1);
  }
  console.log(stats?.toString('minimal'));
  console.log();

  const isCompiledSuccessfully = !stats?.hasErrors();
  if (isCompiledSuccessfully) {
    server = spawn(
      'node',
      ['--inspect', path.join(__dirname, '..', 'dist/src/server.js')],
      {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development', SERVER: true },
      }
    );
  }
});
