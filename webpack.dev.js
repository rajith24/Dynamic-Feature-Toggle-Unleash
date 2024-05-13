const webpack = require('webpack');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { merge } = require('webpack-merge');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const Dotenv = require('dotenv-webpack');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const htmlPlugin = new HtmlWebpackPlugin({
    template: "./public/index.html",
    filename: "./index.html"
});

const fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    "path": require.resolve("path-browserify"),
    "util": require.resolve('util'),
    "process": require.resolve('process/browser'),
};

const config = {
    mode: 'development',
    entry: {
        bundle: path.join(__dirname, '/src/index.js')
    },
    devServer: {
        port: 8000,
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        historyApiFallback: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        },
        // devMiddleware: {
        //     index: false, // specify to enable root proxying
        //   },
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:3001',
                changeOrigin: true,
            }
        ],
        allowedHosts: 'all',
        open: true,
        hot: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.png'],
        fallback: fallback,
        alias: {
            process: "process/browser"
        }
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        },
        {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.yml$/,
            use: ['yaml-loader'], // Add yaml-loader for YAML files
        },
        {
            test: /\.(woff|woff2)$/i,
            type: 'asset/resource',
            generator: {
                filename: 'image/[name][ext]'
            }
        },
        {
            test: /\.(jpe?g|png|jpg|svg|gif)$/i,
            use: [
                // 'url-loader',
                'file-loader',
                {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: [0.1, 0.1],
                            //   quality: [0.65, 0.9],
                            //   speed: 4,
                        },
                        // gifsicle: {
                        //   interlaced: false,
                        // },
                        // the webp option will enable WEBP
                        webp: {
                            quality: 75,
                        },
                    },
                },
                //     {
                //     loader:'file-loader',
                //     options:{
                //         name:'[name].[hash:6].[ext]',
                //         outputPath:'images',
                //         publicPath:'images',
                //         emitFile:true,
                //         esModule:false,
                //     }
                // },
                // {
                //     loader:'webp-loader',
                //     options:{
                //         quality:13
                //     }
                // }
            ],
            generator: {
                filename: 'images/[name]-[hash][ext]'
            }
        },
        {
            test: /\.webp$/,
            use: [{
                loader: 'url-loader',
            },],
        },
        {
            test: /\.html$/,
            use: 'html-loader',
        },
        ]
    },
    plugins: [
        new Dotenv(),
        // new BundleAnalyzerPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        htmlPlugin,
        new CompressionPlugin(),

        new ModuleFederationPlugin({
            name: "Host",
            filename: "remoteEntry.js",
            remotes: {
            },
            shared: packageJson.dependencies,
            
        }),
    ],
    optimization: {
    },
};

module.exports = merge(config, {
    resolve: {
        fallback: fallback
    },
    resolve: {
        alias: {
            'jsonwebtoken': 'jwt-decode'
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        })
    ],
    ignoreWarnings: [/Failed to parse source map/]
});
