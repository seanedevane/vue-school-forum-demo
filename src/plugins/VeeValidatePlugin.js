import firebase from '@/helpers/firebase'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min, url } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'

export default (app) => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('url', url)
  defineRule('unique', async (value, args) => {
    let collection, field, excluding
    if (Array.isArray(args)) {
      // if in array format, destructure
      [collection, field, excluding] = args
    } else {
      // if in object format, destructure
      ({ collection, field, excluding } = args)
    }
    if (value === excluding) return true
    const querySnapshot = firebase.firestore().collection(collection).where(field, '==', value).get()
    return querySnapshot.empty
  })

  configure({
    generateMessage: localize('en', {
      messages: {
        required: '{field} field is required',
        email: '{field} must be a valid email',
        min: '{field} must be at least 0:{min} characters long',
        unique: '{field} is already taken',
        url: '{field} must be a valid URL'
      }
    })
  })
  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}
