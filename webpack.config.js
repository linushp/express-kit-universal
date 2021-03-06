'use strict';

var webpack = require('webpack');
var package_json = require("./package");
var env = process.env.NODE_ENV;



var config = {
    externals: {
    },
    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
        ]
    },
    output: {
        library: 'ExpressKitUniversal',
        libraryTarget: 'umd'
    },
    plugins: [
        {
            apply: function apply(compiler) {
                compiler.parser.plugin('expression global', function expressionGlobalPlugin() {
                    this.state.module.addVariable('global', "(function() { return this; }()) || Function('return this')()")
                    return false
                })
            }
        },
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        }),
        new webpack.BannerPlugin("ExpressKitUniversal , version " + package_json.version + ", build time : " + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString())

    ]
};

if (env === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                warnings: false
            }
        })
    )
}

module.exports = config;
