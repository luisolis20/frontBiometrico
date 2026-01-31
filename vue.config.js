const path = require('path');
const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,

  // ✅ Usa ruta raíz en producción (evita revelar nombre de carpeta)
  publicPath: process.env.NODE_ENV === 'production' ? '/biometrico/' : '/',

  // ✅ Carpeta limpia para build
  outputDir: 'dist',
  assetsDir: 'assets',

  productionSourceMap: false, // ❌ Evita que el navegador muestre código fuente (map files)

   chainWebpack: config => {
    // ELIMINADO: Ya no necesitamos la regla 'ts' ni 'ts-loader'
    // Webpack por defecto ya sabe manejar .js y .vue
  },
  
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
      // Simplificamos las extensiones (puedes quitar .ts y .tsx)
      extensions: ['.js', '.jsx', '.vue'], 
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
      // ✅ Define variables globales seguras para tus URLs
      new webpack.DefinePlugin({
        __API_BIOMETRICO__: JSON.stringify(
          process.env.NODE_ENV === 'production'
            ? 'http://biometricobackend.test/api'
            : 'http://biometricobackend.test/api'
        ),
        __API_BOLSA__: JSON.stringify(
          process.env.NODE_ENV === 'production'
            ? 'http://vinculacionconlasociedad.utelvt.edu.ec/backendbolsaempleo/api'
            : 'http://vinculacionconlasociedad.utelvt.edu.ec/backendbolsaempleo/api'
        ),
      }),
    ],
    output: {
      // ✅ Archivos con hash aleatorio (ocultan nombres)
      filename: 'assets/js/[name].[contenthash].js',
      chunkFilename: 'assets/js/[name].[contenthash].js',
    },
  },

  devServer: {
    proxy: {
      '/api': {
        target: 'http://biometricobackend.test',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
});