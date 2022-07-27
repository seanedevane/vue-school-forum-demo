import firebase from 'firebase'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'

export default (app) => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('unique', async (value, args) => {
    let collection, field
    if (Array.isArray(args)) {
      // if in array format, destructure
      [collection, field] = args
    } else {
      // if in object format, destructure
      ({ collection, field } = args)
    }
    const querySnapshot = firebase.firestore().collection(collection).where(field, '==', value).get()
    return querySnapshot.empty
  })

  configure({
    generateMessage: localize('en', {
      messages: {
        required: '{field} field is required',
        email: '{field} must be a valid email',
        min: '{field} must be at least 0:{min} characters long',
        unique: '{field} is already taken'
      }
    })
  })
  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}
