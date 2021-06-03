const _ = require('lodash');
const { init, router } = require('./upload');

module.exports = {
  bind: (fpm) => {
    fpm.registerAction('FPM_ROUTER', () => {
      const c = fpm.getConfig('qiniu')
      let qiniuConfig = _.assign({
        bucket: '',
        domain: '',
        ACCESS_KEY: '',
        SECRET_KEY: '',
      }, c || {})
      init(qiniuConfig)
      fpm.app.use(router.routes()).use(router.allowedMethods())
    })
  }
}
