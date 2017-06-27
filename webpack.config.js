var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {'example': './examples/src/example.js', 'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry'},
    output: {
        path: path.resolve(__dirname, 'examples'),
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
        }]
    }
};