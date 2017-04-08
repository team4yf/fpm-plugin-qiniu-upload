import _ from 'lodash'
import { init, router } from './upload'

export default {
  bind: (fpm) => {
    fpm.registerAction('FPM_ROUTER', () => {
      const c = fpm.getConfig('qiniu')
      let qiniuConfig = _.assign({
        bucket: 'yfsoft',
        domain: 'olk3bzfd5.bkt.clouddn.com',
        ACCESS_KEY: '65nep44MNB8Ft1v_L1f7jaSnP8P07buuMMN4kI81',
        SECRET_KEY: 'kZxy-i93_B98yg4lNn7XmSujeZh_JWRxQOJX3E_m',
      }, c || {})
      init(qiniuConfig)
      fpm.app.use(router.routes()).use(router.allowedMethods())
    })
  }
}
