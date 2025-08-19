const { defineConfig } = require('@vue/cli-service');

const output_format = (config) => {
    config.output.filename = 'js/[name].[contenthash:8].min.js';
    config.output.chunkFilename = 'js/[name].[contenthash:8].min.js';
};

module.exports = defineConfig({
    chainWebpack: (config) => {
        config.plugin('html').tap((args) => {
            args[0].title = 'SUNFLEX INFORMATION SYSTEM';
            return args;
        });
    },

    configureWebpack: process.env.NODE_ENV === 'local' ? (config) => { } : output_format,

    devServer: {
        proxy: {
            '/api': {
                target: 'https://thesis-posting-and-leave-request-api.onrender.com',
                changeOrigin: true
            }
        },
        open: true,
        host: '0.0.0.0',
        allowedHosts: 'all'
    }
});
