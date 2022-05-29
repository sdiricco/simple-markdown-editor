module.exports = {
  css: {
    loaderOptions: {
      // pass options to sass-loader
      // @/ is an alias to src/
      // so this assumes you have a file named `src/variables.sass`
      // Note: this option is named as "prependData" in sass-loader v8
      scss: {
        additionalData: `@import "~@/sass/variables.scss";`
      },
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        "productName": 'Example',
        "extraResources": [
          {
            "from": "./src/extra-resources/",
            "to": "./",
            "filter": [
              "**/*"
            ]
          }
        ]
      }
    }
  }
}
