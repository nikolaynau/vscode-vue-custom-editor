module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devtool: process.env.NO_SOURCE_MAP ? false : "source-map",
    plugins: []
  }
}
