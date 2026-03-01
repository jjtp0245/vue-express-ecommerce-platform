import Vue from 'vue'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, numeric, confirmed } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'กรุณาระบุ'
})

extend('numeric', {
  ...numeric,
  message: 'กรุณาระบุเลขเท่านั้น'
})

extend('confirmed', {
  ...confirmed,
  message: 'รหัสผ่านไม่ตรงกัน'
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
