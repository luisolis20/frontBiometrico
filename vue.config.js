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

  // ===================================================
  // 🚀 ADICIÓN CLAVE PARA TYPESCRIPT (chainWebpack)
  // ===================================================
  chainWebpack: config => {
    // 1. Configurar la regla para archivos .ts
    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        // Esto es CLAVE para que ts-loader procese TS dentro de los archivos .vue
        appendTsSuffixTo: [/\.vue$/], 
      });

    // Opcional: Si usas Vue 3 con <script setup lang="ts">,
  // a veces es necesario asegurar que vue-loader sepa cómo manejarlo.
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        // Asegura que las opciones de compilación sean correctas si necesitas algo específico de Vue 3
        return options;
      });
  },
  // ===================================================
  
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
      // Esto es CLAVE para que Webpack sepa qué extensiones buscar:
      extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'], 
    },
    optimization: {
      minimize: true, // ✅ Minifica todo el código JS y CSS
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