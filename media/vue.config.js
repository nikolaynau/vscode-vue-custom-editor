const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devtool: process.env.NO_SOURCE_MAP ? false : "source-map",
    plugins: []
  },
  chainWebpack: config => {
    if (isProduction) {
      config.optimization.splitChunks(false);
    }
    if (process.env.NO_MINIFY) {
      config.optimization.minimize(false);
    }
  },
  assetsDir: "assets",
  filenameHashing: isProduction ? false : true
}
