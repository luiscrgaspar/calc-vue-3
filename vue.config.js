const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    if (process.env.DISABLE_FORK_TS_CHECKER === 'true') {
      config.plugins.delete('fork-ts-checker')
    }
  },
})
