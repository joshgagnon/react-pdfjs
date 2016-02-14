var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {'example': './examples/src/example.js'},
    output: {
        path: path.resolve(__dirname, 'examples'),
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            query: {
                presets: ['react', 'es2015', "stage-0"]
            }
        }]
    }
};