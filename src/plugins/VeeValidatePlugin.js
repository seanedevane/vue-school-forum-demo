import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'

export default (app) => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)

  configure({
    generateMessage: localize('en', {
      messages: {
        required: '{field} field is required',
        email: '{field} must be a valid email',
        min: '{field} must be at least 0:{min} characters long'
      }
    })
  })
  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}
