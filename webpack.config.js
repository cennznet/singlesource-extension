// Slience `DeprecationWarning: Tapable.plugin is deprecated` caused by webpack-extension-manifest-plugin
process.noDeprecation = true;
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const baseManifest = require('./baseManifest.ts');
const pkg = require('./package.json');

const webpack = require('webpack');

module.exports = (env, {mode = 'development'}) => {
  const DEV = mode ==='development';
  const devExtend = DEV
    ? {
      // unsafe-eval will allow us to dispatch action from redux-devtool
      content_security_policy: 'script-src \'self\' \'unsafe-eval\'; object-src \'self\''
    }
    : {};

  const extend = {
    version: pkg.version,
    ...devExtend
  };

  return [
    {
      entry: {
        popup: './src/popup/index.tsx',
        background: './src/background/index.ts',
        contentScript: './src/content_script/index.ts'
      },
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx|js|jsx)$/,
            use: {
              loader: require.resolve('babel-loader'),
              options: require('@plugnet/dev-react/config/babel')
            },
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      },
      node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      },
      stats: {
        colors: true
      },
      devtool: 'source-map',
      plugins: [
        new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
        new webpack.DefinePlugin({
          'process.env.mode': JSON.stringify(mode)
        }),
        new CopyWebpackPlugin([
          {from: './public'}
        ]),
        new WebpackExtensionManifestPlugin({
          config: {base: baseManifest, extend}
        }),
        new webpack.HotModuleReplacementPlugin()
      ],
      devServer: {
        contentBase: path.join(__dirname, 'dist'),
        hot: true,
        port: 9000
      }
    },
    {
      entry: {
        singleSource: './src/injection/index.ts'
      },
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SingleSource',
        libraryExport: 'default',
        libraryTarget: 'var'
      },
      module: {
        rules: [
          {
            test: /\.(ts|js)$/,
            use: {
              loader: require.resolve('babel-loader'),
              options: require('@plugnet/dev-react/config/babel')
            },
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.ts']
      },
      stats: {
        colors: true
      },
      devtool: 'source-map'
    }
  ];
};
