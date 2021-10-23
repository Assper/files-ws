const path = require('path')
const fs = require('fs')

class TemplateLoader {
  constructor(baseDir, ...exts) {
    this.base = baseDir
    this.exts = exts
  }

  load(cb) {
    return this.exts.map((ext) => this.templates(ext, cb)).flat()
  }

  templates(ext, cb) {
    const pages_dir = path.join(this.base, `${ext}/pages`)
    if (!fs.existsSync(pages_dir)) return []

    const pattr = new RegExp(`\.${ext}$`, 'i')
    const pages = fs.readdirSync(pages_dir).filter(fileName => fileName.endsWith(`.${ext}`))
    return pages.map((page) => cb({
      template: path.join(pages_dir, page),
      filename: page.replace(pattr, '.html')
    }))
  }
}

module.exports = TemplateLoader
