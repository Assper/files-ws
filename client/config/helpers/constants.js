const path = require('path')

exports.PATHS = {
  src: path.join(process.cwd(), 'src'),
  dist: path.join(process.cwd(), 'dist'),
  assets: 'assets/'
}

exports.IS_DEV = process.env.NODE_ENV !== 'production'
