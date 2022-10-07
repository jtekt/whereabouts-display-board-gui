module.exports = {
  devServer: {
    host: '0.0.0.0'
  },

  pwa: {
    name: '行先掲示板',
    themeColor: '#444444',
  },

  transpileDependencies: [
    'vuetify'
  ],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false
    },
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        win: {
          icon: 'build/icons/icon.png',
        }
      }
    }
  }
}
