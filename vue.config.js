module.exports = {
  "assetsDir": "assets",
  "css": {
    "sourceMap": process.env.NODE_ENV === 'development'
  },  
  "productionSourceMap": false,
  "configureWebpack": {
    "devtool": 'source-map'
  }
}